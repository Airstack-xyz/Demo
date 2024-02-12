/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from 'classnames';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Dropdown, DropdownHandle } from '../Dropdown';
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
  formatBytes,
  formatNumber,
  getActiveDownload,
  listenTaskAdded,
  removeFromActiveDownload,
  saveToActiveDownload
} from './utils';
import { AlertYellow, Download, HistoryIcon, NoItems, Retry } from './Icons';
import { restartTaskMutation } from '../../queries/csv-download/restart';
import { AddCardModal } from './AddCardModal';
import { useAuth } from '../../hooks/useAuth';
import {
  Failed,
  FileReadyToDownload,
  PreparingFile,
  LargeDatasetWarning
} from './Alerts';
import { historyPage } from '../../constants';
import { showToast } from '../../utils/showToast';

type Task = NonNullable<
  NonNullable<GetTasksHistoryQuery['GetCSVDownloadTasks']>[0]
>;

const maxRetryCount = 3;
const largeFileAlertDiffTime = 1000 * 60 * 30; // 30 minutes
const inactiveStatus = [Status.Cancelled, Status.Completed];
function isActive(item: Task | null) {
  return Boolean(
    item &&
      !inactiveStatus.includes(item.status as Status) &&
      (item.retryCount || 0) < maxRetryCount
  );
}

function isLargeFile(createdAt: number, status: Status) {
  const createdAtDate = new Date(createdAt);
  const time = new Date(Date.now() - largeFileAlertDiffTime);
  return (
    createdAtDate.getTime() < time.getTime() && !inactiveStatus.includes(status)
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
  | 'createdAt'
  | 'downloadedAt'
>;

type AddCardModalData = {
  visible: boolean;
  type?: 'subscription' | 'renew';
};

const alertTimeout = 5000;
const pollingInterval = 5000;

const notSubscribedError = 'graphql: User does not have an active subscription';

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
  const [addCardModalData, setAddCardModalData] = useState<AddCardModalData>({
    visible: false,
    type: 'subscription'
  });
  const [taskToCancel, setTaskToCancel] = useState<number | null>(null);
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [taskFailed, setTaskFailed] = useState(false);
  const [foundLargeDataset, setFoundLargeDataset] = useState(false);
  const activeRef = useRef<number[]>([]);
  const [inProgressDownloads, setInProgressDownloads] = useState<number[]>([]);

  const abortController = useRef<AbortController | null>(null);
  const [tasks, setTasks] = useState<Option[]>([]);
  const getHistoryRef = useRef<null | ((fetchAll?: boolean) => Promise<void>)>(
    null
  );

  const dropdownRef = useRef<DropdownHandle>(null);

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
        if (!dropdownRef.current?.isVisible()) {
          setFileDownloaded(true);
        }
        getHistoryRef.current?.();
      }

      if (
        (status === Status.Failed ||
          status === Status.CreditCalculationFailed) &&
        retryCount &&
        retryCount >= maxRetryCount
      ) {
        if (!dropdownRef.current?.isVisible()) {
          showFailedAlert();
        }
        getHistoryRef.current?.();
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
      let hasLargeFile = false;

      active.forEach(item => {
        if (!item) return;

        if (item.status === Status.Completed && !item.downloadedAt) {
          downloadCompleted = true;
          removeFromActiveDownload(item.id);
        }

        if (isLargeFile(item.createdAt, item.status!)) {
          hasLargeFile = true;
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

      if (downloadCompleted && !dropdownRef.current?.isVisible()) {
        setFileDownloaded(true);
      } else if (downloadFailed && !dropdownRef.current?.isVisible()) {
        showFailedAlert();
      } else if (hasLargeFile && !dropdownRef.current?.isVisible()) {
        setFoundLargeDataset(true);
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

      setInProgressDownloads(activeRef.current);

      let _data = [...data.GetCSVDownloadTasks].filter(item => !item?.expired);

      if (!fetchAll) {
        pollSavedTasks(_data);

        _data = _data.filter(
          item =>
            (item?.status === Status.Completed && !item?.downloadedAt) ||
            isActive(item)
        );
      } else {
        _data = _data.filter(
          item => !item?.downloadedAt && item?.status !== Status.Cancelled
        );
      }

      const active = _data?.filter(item => isActive(item));
      activeRef.current = active.map(item => item!.id);

      const tasks = _data
        .map(item => ({
          value: '',
          id: item!.id as number,
          label: item!.name as string,
          status: item!.status as Status,
          isActive: isActive(item),
          fileSize: item!.fileSize as number,
          totalRows: item!.totalRows as number,
          creditsUsed: item!.creditsUsed as number,
          creditPrice: item!.creditPrice as number,
          downloadedAt: item!.downloadedAt as string,
          createdAt: item!.createdAt as number
        }))
        .sort(item => (item.isActive ? -1 : 1));

      // eslint-disable-next-line
      // @ts-ignore
      setTasks(tasks);
    },
    [fetchHistory, pollSavedTasks]
  );

  getHistoryRef.current = getHistory;

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
      setInProgressDownloads(activeRef.current);
      saveToActiveDownload(id);
      pollStatus(id);
      if (!dropdownRef.current?.isVisible()) {
        setNewTaskAdded(true);
      }
    });
  }, [pollStatus]);

  useEffect(() => {
    getHistory(false);
  }, [getHistory]);

  const removeTask = useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleDownload = useCallback(
    async (taskId: number) => {
      const subscriptionStatus = user?.credits?.[0]?.subscription?.status;
      const hasSubscription =
        subscriptionStatus === 'active' || subscriptionStatus === 'past_due';

      if (!hasSubscription) {
        setAddCardModalData({ visible: true, type: 'subscription' });
        return;
      }

      const { data, error } = await downloadTask({ taskId });

      const message = error?.message || error?.[0]?.message;
      if (message && message === notSubscribedError) {
        setAddCardModalData({ visible: true, type: 'renew' });
        return;
      }

      const downloadUrl = data?.DownloadCSV?.url;

      if (downloadUrl) {
        // When user clicks download CSV button for a prepared file:
        // 1. close the dropdown automatically,
        // 2. clear that item from the dropdown list and
        // 3. show a download success toast
        dropdownRef.current?.hide();
        removeTask(taskId);
        showToast('Download successful!');
        setTimeout(() => {
          window.open(downloadUrl, '_blank');
        }, 500);
      }
    },
    [downloadTask, removeTask, user?.credits]
  );

  const showDownload = useCallback(() => {
    setNewTaskAdded(false);
    setFileDownloaded(false);
    setTaskFailed(false);
    setFoundLargeDataset(false);
    getHistory();
  }, [getHistory]);

  const closeFilterPreparation = useCallback(() => {
    setNewTaskAdded(false);
  }, []);

  // priority to display alert - green, red, blue, yellow
  const showTooltip =
    fileDownloaded || newTaskAdded || taskFailed || foundLargeDataset;

  const alert = useMemo(() => {
    if (fileDownloaded) {
      return (
        <FileReadyToDownload
          onClose={() => {
            setFileDownloaded(false);
          }}
        />
      );
    }

    if (newTaskAdded) {
      return <PreparingFile onClose={closeFilterPreparation} />;
    }
    if (taskFailed) {
      return (
        <Failed
          onClose={() => {
            setTaskFailed(false);
          }}
        />
      );
    }

    if (foundLargeDataset) {
      return (
        <LargeDatasetWarning
          onClose={() => {
            setFoundLargeDataset(false);
          }}
        />
      );
    }
  }, [
    closeFilterPreparation,
    fileDownloaded,
    foundLargeDataset,
    newTaskAdded,
    taskFailed
  ]);

  return (
    <div>
      {addCardModalData?.visible && (
        <AddCardModal
          type={addCardModalData.type}
          onRequestClose={() => {
            setAddCardModalData({ visible: false });
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
        content={alert}
      >
        <div className="relative">
          {inProgressDownloads.length > 0 && (
            <span className="absolute -right-2 -top-1.5 bg-stroke-highlight-blue w-5 h-5 flex-col-center rounded-full text-xs z-[2]">
              {inProgressDownloads.length}
            </span>
          )}
          <Dropdown
            dropdownRef={dropdownRef}
            options={
              tasks.length
                ? tasks
                : [{ id: -1, label: '', value: '', isActive: false } as Option]
            }
            onChange={() => {
              // console.log('do nothing');
            }}
            heading={
              <div className="flex items-center justify-between">
                <span>CSV Downloads In Progress</span>
                <a
                  href={historyPage}
                  target="_blank"
                  className="flex items-center cursor-pointer"
                >
                  <HistoryIcon />
                  <span className="text-text-button text-xs font-medium ml-0.5">
                    View History
                  </span>
                </a>
              </div>
            }
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
              const status = option.status as Status;
              const failed =
                status === Status.Failed ||
                status === Status.CreditCalculationFailed;
              const largeFile = isLargeFile(option.createdAt, status);

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
                    {status === Status.Completed && (
                      <div className="mt-2">
                        <div className="mb-2">
                          {formatBytes(option.fileSize || 0, 2)} •{' '}
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
                              disabled={!option.totalRows || downloading}
                              className="py-1 px-3 rounded-full cursor-pointer text-left whitespace-nowrap bg-white text-tertiary mr-5 disabled:bg-opacity-75 disabled:cursor-not-allowed"
                              onClick={() => {
                                handleDownload(option.id);
                              }}
                            >
                              Download CSV ($
                              {formatNumber(option.creditPrice || 0, 4)})
                            </button>
                          ) : null}

                          {!option.downloadedAt && (
                            <button
                              className="ml-2.5 text-white font-medium py-2 px-3 hover:text-opacity-90"
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
                        {!largeFile && (
                          <div>We will notify you once it is ready.</div>
                        )}
                      </div>
                    )}
                    {!isInProgress && !largeFile && failed && (
                      <div className="text-text-secondary mt-2">
                        <div className="flex items-center">
                          Failed to prepare the file. Please try again.
                        </div>
                        <div className="flex items-center mt-3">
                          <button
                            disabled={restartingTask}
                            onClick={() => {
                              handleRestart(option.id);
                            }}
                            className="bg-white text-primary hover:opacity-80 flex items-center rounded-18 pl-2 pr-3 py-1"
                          >
                            <Retry />
                            Retry
                          </button>
                          <button
                            className="ml-2.5 text-white font-medium py-2 px-3 hover:text-opacity-90"
                            onClick={e => {
                              e.preventDefault();
                              setTaskToCancel(option.id);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {status === Status.Cancelled && (
                      <div className="text-text-secondary mt-2">
                        <div className="flex items-center">Cancelled</div>
                      </div>
                    )}
                    {largeFile && (
                      <div className="flex items-start text-text-secondary mt-2">
                        <span className="mt-1 mr-1.5">
                          <AlertYellow />
                        </span>
                        <div className="">
                          This file is rather large. Please wait
                          <div className="mt-1">
                            or contact{' '}
                            <span className="font-semibold text-text-button">
                              csv@airstack.xyz
                            </span>{' '}
                            for more help.
                          </div>
                        </div>
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
