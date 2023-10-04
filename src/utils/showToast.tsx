const toastContainerId = 'toast-container';

function createToastElement(message: string, type: 'positive' | 'negative') {
  const toast = document.createElement('div');
  toast.className = `${
    type === 'positive' ? 'bg-toast-positive' : 'bg-toast-negative'
  } relative z-20 mt-5 py-2 px-3 rounded-18 text-xs font-medium shadow-2xl transition-all ease-in-out -translate-y-[100px]`;
  toast.innerText = message;
  return toast;
}

function getContainer(root: HTMLElement) {
  let container = document.getElementById(toastContainerId);

  if (!container) {
    container = document.createElement('div');
    container.id = toastContainerId;
    container.className =
      'fixed top-0 w-full z-50 flex flex-col justify-center items-center';
    root.appendChild(container);
  }

  return container;
}

export function showToast(
  message: string,
  type: 'positive' | 'negative' = 'positive'
) {
  const root = document.getElementById('root');
  if (!root) return;
  const container = getContainer(root);
  const toast = createToastElement(message, type);

  container.appendChild(toast);

  // animate toast in, wait for next tick to allow for css transition
  setTimeout(() => {
    toast.classList.add('!translate-y-0');
  }, 10);

  setTimeout(() => {
    // animate toast out
    toast.classList.remove('!translate-y-0');
    // wait for animation to finish and then remove toast
    setTimeout(() => {
      container && container.removeChild(toast);
    }, 300);
  }, 3000);
}
