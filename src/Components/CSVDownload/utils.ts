export function triggerNewTaskAddedEvent(taskId: number) {
  window.dispatchEvent(
    new CustomEvent('new-task-added', {
      detail: {
        taskId
      }
    })
  );
}

export function listenTaskAdded(callback: (id: number) => void | (() => void)) {
  const unmountCallback: {
    callbacks: (() => void)[];
  } = { callbacks: [] };

  const callbackHandler = (
    event: CustomEvent<{
      taskId: number;
    }>
  ) => {
    const cb = callback(event.detail.taskId);
    if (cb) {
      unmountCallback.callbacks.push(cb);
    }
  };
  // eslint-disable-next-line
  // @ts-ignore
  window.addEventListener('new-task-added', callbackHandler);
  return () => {
    // eslint-disable-next-line
    // @ts-ignore
    window.removeEventListener('new-task-added', callbackHandler);
    if (unmountCallback.callbacks) {
      unmountCallback.callbacks.forEach(cb => cb());
    }
  };
}

export function formatNumber(number: number, fixed = 2) {
  return Intl.NumberFormat().format(
    (number % 1 ? number.toFixed(fixed) : number) as number
  );
}

export function formatBytes(bytes: number, decimals = 3) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const localStorageKey = 'csv-active-downloads';

export function getActiveDownload() {
  const activeDownloads = localStorage.getItem(localStorageKey);
  return activeDownloads ? activeDownloads.split(',') : [];
}

export function saveToActiveDownload(id: number) {
  const activeDownloads = getActiveDownload();
  if (activeDownloads.includes(id.toString())) {
    return;
  }
  activeDownloads.push(id.toString());
  localStorage.setItem(localStorageKey, activeDownloads.join(','));
}

export function removeFromActiveDownload(id: number) {
  const activeDownloads = getActiveDownload();
  const newActiveDownloads = activeDownloads.filter(
    activeDownload => activeDownload !== id.toString()
  );
  localStorage.setItem(localStorageKey, newActiveDownloads.join(','));
}
