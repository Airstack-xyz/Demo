const toastContainerId = 'toast-container';

function createToatElement(message: string) {
  const toast = document.createElement('div');
  toast.className =
    'relative z-20 mt-5 py-2 px-3 rounded-18 bg-toast-positive font-xs shadow-2xl transition-all ease-in-out -translate-y-[100px]';
  toast.innerText = message;
  return toast;
}

function getCotainer(root: HTMLElement) {
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

export function showToast(message: string) {
  const root = document.getElementById('root');
  if (!root) return;
  const container = getCotainer(root);
  const toast = createToatElement(message);

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
