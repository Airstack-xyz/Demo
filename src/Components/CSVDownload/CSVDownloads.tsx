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
  RestartTaskMutation,
  RestartTaskMutationVariables,
  Status
} from '../../../__generated__/types';
import { cancelTaskMutation } from '../../queries/csv-download/cancel';
import { getTaskStatusQuery } from '../../queries/csv-download/status';
import { downloadCsvMutation } from '../../queries/csv-download/download';
import { CancelDownloadModal } from '../CSVDownload/CancelDownloadModal';
import {
  formatNumber,
  getActiveDownload,
  listenTaskAdded,
  removeFromActiveDownload,
  saveToActiveDownload
} from './utils';
import { CheckCircle, Download, NoItems, Retry } from './Icons';
import { restartTaskMutation } from '../../queries/csv-download/restart';
import { AddCardModal } from './AddCardModal';
import { useAuth } from '../../hooks/useAuth';
import { Failed, FileReadyToDownload, PreparingFile } from './Alerts';

type Task = NonNullable<
  NonNullable<GetTasksHistoryQuery['GetCSVDownloadTasks']>[0]
>;

const maxRetryCount = 3;
function isActive(item: Task | null) {
  const inactiveStatus = [Status.Cancelled, Status.Completed];
  return Boolean(
    item &&
      !inactiveStatus.includes(item.status as Status) &&
      (item.retryCount || 0) < maxRetryCount
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

const alertTimeout = 5000;
const pollingInterval = 5000;
export function CSVDownloads() {
  const [fetchHistory] = useCSVQuery<
    GetTasksHistoryQuery,
    GetTasksHistoryQueryVariables
  >(historyQuery);

  const [cancelTask] = useCSVQuery<
    CancelTaskMutation,
    CancelTaskMutationVariables
  >(cancelTaskMutation);

  const [restartTask, { loading: restartingTask }] = useCSVQuery<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(restartTaskMutation);

  const [getStatus] = useCSVQuery<
    GetTaskStatusQuery,
    GetTaskStatusQueryVariables
  >(getTaskStatusQuery);

  const [downloadTask, { loading: downloading }] = useCSVQuery<
    DownloadCsvMutation,
    DownloadCsvMutationVariables
  >(downloadCsvMutation);

  const { user } = useAuth();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState<number | null>(null);
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [taskFailed, setTaskFailed] = useState(false);
  const activeRef = useRef<number[]>([]);
  const [inProgressDownloads, setInProgressDownloads] = useState<number[]>([]);

  const abortController = useRef<AbortController | null>(null);
  const [tasks, setTasks] = useState<Option[]>([]);
  const [downloadCompletedFor, setDownloadCompletedFor] = useState<
    number | null
  >(null);

  const showFailedAlert = useCallback(() => {
    setTaskFailed(true);
    setTimeout(() => {
      setTaskFailed(false);
    }, alertTimeout);
  }, []);

  const pollStatus = useCallback(
    async (id: number) => {
      if (activeRef.current.indexOf(id) === -1) {
        return;
      }

      const { data } = await getStatus({ taskId: id });

      if (!data?.GetTaskStatus) {
        return;
      }
      const { status, retryCount } = data.GetTaskStatus;

      if (isActive(data.GetTaskStatus as Task)) {
        setTimeout(() => {
          pollStatus(id);
        }, pollingInterval);
        return;
      }

      if (status === Status.Completed) {
        setFileDownloaded(true);
      }

      if (
        (status === Status.Failed ||
          status === Status.CreditCalculationFailed) &&
        retryCount &&
        retryCount >= maxRetryCount
      ) {
        showFailedAlert();
      }

      activeRef.current = activeRef.current.filter(item => item !== id);

      setInProgressDownloads(activeRef.current);
    },
    [getStatus, showFailedAlert]
  );

  const pollSavedTasks = useCallback(
    (tasks: (null | Task)[]) => {
      const savedTasks = getActiveDownload();
      const active: Task[] = [];
      tasks.forEach(item => {
        if (!item) {
          return;
        }

        if (savedTasks.includes(item.id.toString())) {
          active.push(item);
        } else if (
          isActive(item) ||
          (item.status === Status.Completed && !item.downloadedAt)
        ) {
          saveToActiveDownload(item.id);
          active.push(item);
        }
      });

      let downloadCompleted = false;
      let downloadFailed = false;

      active.forEach(item => {
        if (!item) return;

        if (item.status === Status.Completed && !item.downloadedAt) {
          downloadCompleted = true;
          removeFromActiveDownload(item.id);
        }

        if (isActive(item)) {
          pollStatus(item.id);
          if (!activeRef.current.includes(item.id)) {
            activeRef.current.push(item.id);
          }
        } else {
          removeFromActiveDownload(item.id);
          downloadFailed = downloadFailed || item.status === Status.Failed;
          activeRef.current = activeRef.current.filter(id => id !== item.id);
        }
      });

      setInProgressDownloads(activeRef.current);

      if (downloadCompleted) {
        setFileDownloaded(true);
      } else if (downloadFailed) {
        showFailedAlert();
      }
    },
    [pollStatus, showFailedAlert]
  );

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

      pollSavedTasks(_data);

      if (!fetchAll) {
        _data = _data.filter(
          item =>
            (item?.status === Status.Completed && !item?.downloadedAt) ||
            isActive(item)
        );
      } else {
        _data = _data.filter(
          item =>
            item?.status !== Status.Cancelled &&
            item?.status !== Status.Completed &&
            !item?.downloadedAt
        );
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
    [fetchHistory, pollSavedTasks]
  );

  const handleRestart = useCallback(
    async (taskId: number) => {
      await restartTask({ taskId });
      getHistory();
    },
    [getHistory, restartTask]
  );

  useEffect(() => {
    return listenTaskAdded((id: number) => {
      activeRef.current.push(id);
      saveToActiveDownload(id);
      pollStatus(id);
      setNewTaskAdded(true);

      const timer = setTimeout(() => {
        setNewTaskAdded(false);
      }, alertTimeout);

      return () => {
        clearTimeout(timer);
      };
    });
  });

  useEffect(() => {
    getHistory(false);
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
        setDownloadCompletedFor(taskId);
        setTimeout(() => {
          getHistory().then(() => {
            setDownloadCompletedFor(null);
          });
        }, alertTimeout);
      }
    },
    [downloadTask, getHistory, user?.credits]
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
            <FileReadyToDownload
              onClose={() => {
                setFileDownloaded(false);
              }}
            />
          ) : taskFailed ? (
            <Failed />
          ) : (
            <PreparingFile />
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
              const downloadedNow = downloadCompletedFor === option.id;

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
                        {!downloadedNow && (
                          <div>
                            {option.totalRows ? (
                              <button
                                disabled={!option.totalRows || downloading}
                                className="py-1 px-3 rounded-full cursor-pointer text-left whitespace-nowrap bg-white text-tertiary mr-5 disabled:bg-opacity-75 disabled:cursor-not-allowed"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDownload(option.id);
                                }}
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
                        )}
                        {downloadedNow && (
                          <div className="flex items-center">
                            <CheckCircle />{' '}
                            <span className="ml-1 text-toast-positive font-medium">
                              Download successful!
                            </span>
                          </div>
                        )}
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
