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
  return number % 1 ? number.toFixed(fixed) : number;
}

const localStorageKey = 'csv-active-downloads';

export function getActiveDownload() {
  const activeDownloads = localStorage.getItem(localStorageKey);
  return activeDownloads ? activeDownloads.split(',') : [];
}

export function saveToActiveDownload(id: number) {
  const activeDownloads = getActiveDownload();
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
