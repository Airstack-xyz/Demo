/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from 'classnames';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useInProgressDownloads } from '../store/csvDownload';
import { Dropdown } from './Dropdown';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';
import { useCSVQuery } from '../hooks/useCSVQuery';
import { historyQuery } from '../queries/csv-download/history';
import {
  CancelTaskInput,
  CancelTaskMutation,
  DownloadCsvMutation,
  DownloadCsvMutationVariables,
  GetTaskStatusQuery,
  GetTaskStatusQueryVariables,
  GetTasksHistoryQuery,
  GetTasksHistoryQueryVariables,
  Status
} from '../../__generated__/types';
import { cancelTaskMutation } from '../queries/csv-download/cancel';
import { getTaskStatusQuery } from '../queries/csv-download/status';
import { downloadCsvMutation } from '../queries/csv-download/download';

type Task = NonNullable<
  NonNullable<GetTasksHistoryQuery['GetCSVDownloadTasks']>[0]
>;

function isAactive(item: Task | null) {
  return Boolean(
    item &&
      item.status !== Status.Cancelled &&
      item.status !== Status.Completed &&
      (item.retryCount || 0) < 3
  );
}

export function CSVDownloads() {
  const [fetchHistory] = useCSVQuery<
    GetTasksHistoryQuery,
    GetTasksHistoryQueryVariables
  >(historyQuery);

  const [cancelTask] = useCSVQuery<CancelTaskMutation, CancelTaskInput>(
    cancelTaskMutation
  );

  const [getStatus] = useCSVQuery<
    GetTaskStatusQuery,
    GetTaskStatusQueryVariables
  >(getTaskStatusQuery);

  const [downloadTask] = useCSVQuery<
    DownloadCsvMutation,
    DownloadCsvMutationVariables
  >(downloadCsvMutation);

  const currentlyPollingRef = useRef<number[]>([]);
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const activeRef = useRef<number[]>([]);
  const [{ inProgressDownloads }, setInProgressDownloads] =
    useInProgressDownloads(['inProgressDownloads']);
  activeRef.current = inProgressDownloads;

  const abortController = useRef<AbortController | null>(null);
  const [tasks, setTasks] = useState<
    {
      id: number;
      label: string;
      status: string;
      isActive: boolean;
      value: '';
    }[]
  >([]);

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
      const status = data.GetTaskStatus.status as Status;

      if (isAactive(data.GetTaskStatus as Task)) {
        setTimeout(() => {
          pollStatus(id);
        }, 5000);
        return;
      }

      if (status === 'completed') {
        setFileDownloaded(true);
        setTimeout(() => {
          setFileDownloaded(false);
        }, 5000);
      }

      activeRef.current = activeRef.current.filter(item => item !== id);
      currentlyPollingRef.current = currentlyPollingRef.current.filter(
        item => item !== id
      );

      setInProgressDownloads({
        inProgressDownloads: activeRef.current
      });
      setTasks(tasks =>
        tasks.map(item =>
          item.id === id
            ? {
                ...item,
                status
              }
            : item
        )
      );
    },
    [getStatus, setInProgressDownloads]
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

  const getHistory = useCallback(async () => {
    if (abortController) {
      abortController.current?.abort();
    }
    abortController.current = new AbortController();
    const { data, error } = await fetchHistory();

    if (!data?.GetCSVDownloadTasks || error) {
      return;
    }

    const active = data.GetCSVDownloadTasks?.filter(item => isAactive(item));

    if (active) {
      activeRef.current = active.map(item => item!.id);
    }

    setInProgressDownloads({
      inProgressDownloads: activeRef.current
    });

    const _data = [...data.GetCSVDownloadTasks];
    _data.length = 5;

    setTasks(
      _data.map(item => ({
        id: item!.id as number,
        label: item!.name as string,
        status: item!.status as string,
        isActive: isAactive(item),
        value: ''
      }))
    );
  }, [fetchHistory, setInProgressDownloads]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const handleDownload = useCallback(
    async (taskId: number) => {
      const { data } = await downloadTask({ taskId });
      if (data?.DownloadCSV?.url) {
        window.open(data.DownloadCSV.url, '_blank');
      }
    },
    [downloadTask]
  );

  const showDownload = useCallback(() => {
    setNewTaskAdded(false);
    setFileDownloaded(false);
    getHistory();
  }, [getHistory]);

  const showTooltip = fileDownloaded || newTaskAdded;

  return (
    <div>
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
              Your file is ready to be downloaded
            </div>
          ) : (
            <div className="bg-stroke-highlight-blue rounded-18 p-4 font-medium text-sm leading-7 mt-5 relative">
              <span className="absolute -top-[12px] left-10 w-0 h-0 z-20 border border-solid border-l-[10px] border-l-transparent border-b-[12.5px] border-b-stroke-highlight-blue border-r-[10px] border-r-transparent border-t-transparent"></span>
              <div>Preparing your file!</div>
              <div>We will notify you once it is ready.</div>
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
            options={tasks}
            onChange={() => {
              // console.log('do nothing');
            }}
            heading="CSV Downloads In Progress"
            optionsContainerClassName="min-w-[214px] top-9 !bg-[#303030]"
            renderPlaceholder={(_, isOpen) => (
              <button
                onClick={showDownload}
                className={classNames(
                  'py-1.5 px-3 text-text-button bg-glass-1 rounded-full text-xs font-medium flex-row-center border border-solid border-transparent',
                  {
                    'border-white': isOpen
                    // 'cursor-not-allowed pointer-events-none opacity-80': disabled
                  }
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10.8327 2.5H6.83268C5.89927 2.5 5.43255 2.5 5.07603 2.68166C4.76242 2.84144 4.50746 3.09641 4.34767 3.41002C4.16602 3.76653 4.16602 4.23325 4.16602 5.16667V14.8333C4.16602 15.7667 4.16602 16.2335 4.34767 16.59C4.50746 16.9036 4.76242 17.1586 5.07603 17.3183C5.43255 17.5 5.89927 17.5 6.83268 17.5H12.4993M10.8327 2.5L15.8327 7.5M10.8327 2.5V6.16667C10.8327 6.63337 10.8327 6.86673 10.9235 7.04499C11.0034 7.20179 11.1308 7.32927 11.2877 7.40917C11.4659 7.5 11.6993 7.5 12.166 7.5H15.8327M15.8327 7.5V9.16667M15.8344 12.5V17.4764M15.8344 17.4764V17.5M15.8344 17.4764L15.8579 17.5L17.5246 15.8333M15.8344 17.4764L14.1913 15.8333"
                    stroke="#4B97F7"
                    stroke-width="1.62195"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            )}
            renderOption={({ option }) => {
              const isInProgress = option.isActive;
              return (
                <div className="py-2 px-5 rounded-full mb-2 cursor-pointer text-left whitespace-nowrap w-[340px] ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden">
                      <Icon
                        name="file-arrow-down"
                        className="mr-2"
                        width={14}
                      />
                      <span className="text-ellipsis w-full">
                        {option.label}
                      </span>
                    </div>
                    {isInProgress && (
                      <div className="flex items-center">
                        <button>
                          <Icon
                            name="cancel-circle"
                            onClick={() => {
                              cancelTask({
                                id: option.id
                              });
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  {option.status === 'completed' && (
                    <div className="mt-2">
                      <button
                        className="py-1 px-3 rounded-full cursor-pointer text-left whitespace-nowrap bg-white text-tertiary mr-5"
                        onClick={() => handleDownload(option.id)}
                      >
                        Download CSV
                      </button>
                      <button
                        onClick={() => {
                          cancelTask({
                            id: option.id
                          });
                        }}
                      >
                        Cancel
                      </button>
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
                  {!isInProgress && option.status === 'failed' && (
                    <div className="text-text-secondary mt-2">
                      <div className="flex items-center">
                        Failed to download
                      </div>
                    </div>
                  )}
                  {option.status === 'cancelled' && (
                    <div className="text-text-secondary mt-2">
                      <div className="flex items-center">Cancelled</div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </Tooltip>
    </div>
  );
}
