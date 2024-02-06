/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from 'classnames';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { useCSVQuery } from '../../hooks/useCSVQuery';
import { historyQuery } from '../../queries/csv-download/history';
import {
  CancelTaskMutation,
  CancelTaskMutationVariables,
  CsvDownloadTask,
  DownloadCsvMutation,
  DownloadCsvMutationVariables,
  GetTaskStatusQuery,
  GetTaskStatusQueryVariables,
  GetTasksHistoryQuery,
  GetTasksHistoryQueryVariables,
  Status
} from '../../../__generated__/types';
import { cancelTaskMutation } from '../../queries/csv-download/cancel';
import { getTaskStatusQuery } from '../../queries/csv-download/status';
import { downloadCsvMutation } from '../../queries/csv-download/download';
import { CancelDownloadModal } from '../CSVDownload/CancelDownloadModal';
import { formatNumber, listenTaskAdded } from './utils';
import { Close, Download, NoItems, Retry } from './Icons';
import { restartTaskMutation } from '../../queries/csv-download/restart';
import { AddCardModal } from './AddCardModal';
import { useAuth } from '../../hooks/useAuth';

type Task = NonNullable<
  NonNullable<GetTasksHistoryQuery['GetCSVDownloadTasks']>[0]
>;

function isActive(item: Task | null) {
  return Boolean(
    item &&
      item.status !== Status.Cancelled &&
      item.status !== Status.Completed &&
      (item.retryCount || 0) < 3
  );
}

type Option = {
  id: number;
  label: string;
  value: '';
  isActive: boolean;
} & Pick<
  CsvDownloadTask,
  | 'status'
  | 'fileSize'
  | 'totalRows'
  | 'creditPrice'
  | 'creditsUsed'
  | 'downloadedAt'
>;

let dataFetched = false;
export function CSVDownloads() {
  const [fetchHistory] = useCSVQuery<
    GetTasksHistoryQuery,
    GetTasksHistoryQueryVariables
  >(historyQuery);

  const [cancelTask] = useCSVQuery<
    CancelTaskMutation,
    CancelTaskMutationVariables
  >(cancelTaskMutation);

  // TODO: use proper types here once the BFF has the schema
  const [restartTask, { loading: restartingTask }] =
    useCSVQuery(restartTaskMutation);

  const [getStatus] = useCSVQuery<
    GetTaskStatusQuery,
    GetTaskStatusQueryVariables
  >(getTaskStatusQuery);

  const [downloadTask] = useCSVQuery<
    DownloadCsvMutation,
    DownloadCsvMutationVariables
  >(downloadCsvMutation);

  const { user } = useAuth();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState<number | null>(null);
  const currentlyPollingRef = useRef<number[]>([]);
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [taskFailed, setTaskFailed] = useState(false);
  const activeRef = useRef<number[]>([]);
  const [inProgressDownloads, setInProgressDownloads] = useState<number[]>([]);

  const abortController = useRef<AbortController | null>(null);
  const [tasks, setTasks] = useState<Option[]>([]);

  const getHistory = useCallback(
    async (fetchAll = true) => {
      if (abortController) {
        abortController.current?.abort();
      }
      abortController.current = new AbortController();
      const { data, error } = await fetchHistory();

      if (!data?.GetCSVDownloadTasks || error) {
        return;
      }

      const active = data.GetCSVDownloadTasks?.filter(item => isActive(item));

      if (active) {
        activeRef.current = active.map(item => item!.id);
      }

      setInProgressDownloads(activeRef.current);

      let _data = [...data.GetCSVDownloadTasks];

      if (!fetchAll) {
        _data = _data.filter(
          item =>
            (item?.status === Status.Completed && !item?.downloadedAt) ||
            item?.status === Status.InProgress ||
            item?.status === Status.CalculatingCredits
        );

        // if there is a file that is completed but not downloaded, show the tooltip
        if (
          _data.find(
            item => item?.status === Status.Completed && !item?.downloadedAt
          )
        ) {
          setFileDownloaded(true);
        }
      }

      setTasks(
        _data.map(item => ({
          value: '',
          id: item!.id as number,
          label: item!.name as string,
          status: item!.status as Status,
          isActive: isActive(item),
          fileSize: item!.fileSize as number,
          totalRows: item!.totalRows as number,
          creditsUsed: item!.creditsUsed as number,
          creditPrice: item!.creditPrice as number,
          downloadedAt: item!.downloadedAt as string
        }))
      );
    },
    [fetchHistory, setInProgressDownloads]
  );

  const pollStatus = useCallback(
    async (id: number) => {
      if (activeRef.current.indexOf(id) === -1) {
        return;
      }

      if (currentlyPollingRef.current.indexOf(id) === -1) {
        currentlyPollingRef.current.push(id);
      }

      const { data } = await getStatus({ taskId: id });

      if (!data?.GetTaskStatus) {
        return;
      }
      const { status, retryCount } = data.GetTaskStatus;

      if (isActive(data.GetTaskStatus as Task)) {
        setTimeout(() => {
          pollStatus(id);
        }, 5000);
        return;
      }

      if (status === Status.Completed) {
        setFileDownloaded(true);
        getHistory(true);
      }

      if (
        (status === Status.Failed ||
          status === Status.CreditCalculationFailed) &&
        retryCount &&
        retryCount >= 3
      ) {
        setTaskFailed(true);
      }

      activeRef.current = activeRef.current.filter(item => item !== id);
      currentlyPollingRef.current = currentlyPollingRef.current.filter(
        item => item !== id
      );

      setInProgressDownloads(activeRef.current);
    },
    [getHistory, getStatus, setInProgressDownloads]
  );

  const handleRestart = useCallback(
    async (taskId: number) => {
      await restartTask({ taskId });
      getHistory();
    },
    [getHistory, restartTask]
  );

  useEffect(() => {
    const ids = (inProgressDownloads as number[]).filter(
      id => currentlyPollingRef.current.indexOf(id) === -1
    );
    ids.forEach(id => {
      pollStatus(id);
    });
    if (ids.length > 0) {
      setNewTaskAdded(true);
      const timer = setTimeout(() => {
        setNewTaskAdded(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [inProgressDownloads, pollStatus]);

  useEffect(() => {
    return listenTaskAdded((id: number) => {
      activeRef.current.push(id);
      pollStatus(id);
      setNewTaskAdded(true);

      const timer = setTimeout(() => {
        setNewTaskAdded(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    });
  });

  useEffect(() => {
    getHistory(dataFetched);
    dataFetched = true;
  }, [getHistory]);

  const handleDownload = useCallback(
    async (taskId: number) => {
      const subscriptionStatus = user?.credits?.[0]?.subscription?.status;
      const hasSubscription =
        subscriptionStatus === 'active' || subscriptionStatus === 'past_due';

      if (!hasSubscription) {
        setShowAddCardModal(true);
        return;
      }

      const { data } = await downloadTask({ taskId });
      if (data?.DownloadCSV?.url) {
        window.open(data.DownloadCSV.url, '_blank');
      }
    },
    [downloadTask, user?.credits]
  );

  const showDownload = useCallback(() => {
    setNewTaskAdded(false);
    setFileDownloaded(false);
    getHistory();
  }, [getHistory]);

  const showTooltip = fileDownloaded || newTaskAdded || taskFailed;

  return (
    <div>
      {showAddCardModal && (
        <AddCardModal
          onRequestClose={() => {
            setShowAddCardModal(false);
          }}
        />
      )}
      {taskToCancel && (
        <CancelDownloadModal
          onRequestClose={() => {
            setTaskToCancel(null);
          }}
          onConfirm={() => {
            if (taskToCancel) {
              cancelTask({
                taskId: taskToCancel
              });
            }
            setTaskToCancel(null);
          }}
        />
      )}
      <Tooltip
        disabled={!showTooltip}
        contentClassName={classNames(
          'rounded-18 w-auto bg-transparent -left-7',
          {
            '!flex': showTooltip
          }
        )}
        content={
          fileDownloaded ? (
            <div className="bg-toast-positive rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative">
              <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-toast-positive border-r-[10px] border-r-transparent border-t-transparent"></span>
              <div className="flex items-center">
                <span>Your file is ready to be downloaded</span>
                <span
                  className="ml-2 hover:cursor-pointer"
                  onClick={() => {
                    setFileDownloaded(false);
                  }}
                >
                  <Close />
                </span>
              </div>
            </div>
          ) : (
            <div
              className={classNames(
                'rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative',
                {
                  'bg-stroke-highlight-blue': newTaskAdded,
                  'bg-toast-negative': taskFailed
                }
              )}
            >
              <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-b-stroke-highlight-blue border-r-[10px] border-r-transparent border-t-transparent"></span>
              <div>
                {newTaskAdded
                  ? 'Preparing your file!'
                  : 'Failed to prepare your file due to some error.'}
              </div>
              <div>
                {newTaskAdded
                  ? 'We will notify you once it is ready.'
                  : 'Please try again.'}
              </div>
            </div>
          )
        }
      >
        <div className="relative">
          {inProgressDownloads.length > 0 && (
            <span className="absolute -right-2 -top-1.5 bg-stroke-highlight-blue w-5 h-5 flex-col-center rounded-full text-xs z-[2]">
              {inProgressDownloads.length}
            </span>
          )}
          <Dropdown
            options={
              tasks.length
                ? tasks
                : [{ id: -1, label: '', value: '', isActive: false } as Option]
            }
            onChange={() => {
              // console.log('do nothing');
            }}
            heading="CSV Downloads In Progress"
            optionsContainerClassName="min-w-[214px] top-9 !bg-[#303030] max-h-[50vh] overflow-y-auto"
            renderPlaceholder={(_, isOpen) => (
              <button
                onClick={showDownload}
                className={classNames(
                  'w-10 h-[30px] bg-glass-1 rounded-full text-xs font-medium flex-row-center border border-solid border-transparent hover:opacity-90',
                  {
                    'border-white text-text-button': isOpen,
                    'text-[#8B8EA0]': !isOpen,
                    'text-text-button': inProgressDownloads.length > 0
                    // 'cursor-not-allowed pointer-events-none opacity-80': disabled
                  }
                )}
              >
                <Download />
              </button>
            )}
            renderOption={({ option }) => {
              const isInProgress = option.isActive;
              const failed =
                option.status === Status.Failed ||
                option.status === Status.CreditCalculationFailed;

              if (option.id === -1) {
                // no tasks
                return (
                  <div className="flex flex-col justify-center items-center py-5 w-[340px]">
                    <NoItems />

                    <div className="mt-5 text-text-secondary">
                      No downloads in progress
                    </div>
                  </div>
                );
              }
              return (
                <div className="py-2 px-5 rounded-full mb-2 cursor-pointer text-left whitespace-nowrap w-[340px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden">
                      <Icon
                        name="file-arrow-down"
                        className="mr-2"
                        width={14}
                      />
                      <span className="ellipsis w-full flex-1">
                        {option.label}
                      </span>
                    </div>
                    {isInProgress && (
                      <div className="flex items-center ml-2">
                        <button>
                          <Icon
                            name="cancel-circle"
                            onClick={e => {
                              e.preventDefault();
                              setTaskToCancel(option.id);
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="ml-5">
                    {option.status === Status.Completed && (
                      <div className="mt-2">
                        <div className="mb-2">
                          {formatNumber(option.fileSize || 0, 2)} •{' '}
                          {option.totalRows} rows •{' '}
                          <span className="text-stroke-highlight-blue">
                            {formatNumber(
                              !option.totalRows ? 0 : option.creditsUsed || 0,
                              2
                            )}{' '}
                            credits to download
                          </span>
                        </div>
                        <div>
                          {option.totalRows ? (
                            <button
                              disabled={!option.totalRows}
                              className="py-1 px-3 rounded-full cursor-pointer text-left whitespace-nowrap bg-white text-tertiary mr-5 disabled:bg-opacity-75 disabled:cursor-not-allowed"
                              onClick={() => handleDownload(option.id)}
                            >
                              Download CSV ($
                              {formatNumber(option.creditPrice || 0, 4)})
                            </button>
                          ) : null}
                          {!option.downloadedAt && (
                            <button
                              onClick={e => {
                                e.preventDefault();
                                setTaskToCancel(option.id);
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {isInProgress && (
                      <div className="text-text-secondary">
                        <div className="flex items-center">
                          <img
                            src="images/loader.svg"
                            height={20}
                            width={30}
                            className="mr-2"
                          />{' '}
                          Preparing your file...
                        </div>
                        <div>We will notify you once it is ready.</div>
                      </div>
                    )}
                    {!isInProgress && failed && (
                      <div className="text-text-secondary mt-2">
                        <div className="flex items-center">
                          Failed to prepare the file. Please try again.
                        </div>
                        <button
                          disabled={restartingTask}
                          onClick={() => {
                            handleRestart(option.id);
                          }}
                          className="bg-white text-primary hover:opacity-80 flex items-center rounded-18 pl-2 pr-3 py-1 mt-2"
                        >
                          <Retry />
                          Retry
                        </button>
                      </div>
                    )}
                    {option.status === Status.Cancelled && (
                      <div className="text-text-secondary mt-2">
                        <div className="flex items-center">Cancelled</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </Tooltip>
    </div>
  );
}
