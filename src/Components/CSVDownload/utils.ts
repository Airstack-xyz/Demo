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
