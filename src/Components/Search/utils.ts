const mentionInputId = 'mention-input';
const mentionHighlightId = 'mention-highlight';
const combinationPlacholderId = 'overlay-placeholder';
const tokenBalancesPlaceholder = '+ add another identity to view overlap';
const tokenHoldersPlaceholder = '+ add another project to view overlap';

export function addAndRemoveCombinationPlacholder(
  shouldShowPlaceholder: boolean,
  isTokenBalances: boolean
) {
  const input = document.getElementById(mentionInputId);
  const highlight = document.getElementById(mentionHighlightId);
  const el = document.createElement('span');
  el.id = combinationPlacholderId;
  el.innerText = isTokenBalances
    ? tokenBalancesPlaceholder
    : tokenHoldersPlaceholder;
  el.classList.add('color-text-secondary');

  function getPlceholderEl() {
    return highlight?.querySelector('#' + combinationPlacholderId);
  }

  function handleFocus() {
    const placeholder = getPlceholderEl();
    if (placeholder) {
      highlight?.removeChild(placeholder);
    }
  }

  function handleBlur() {
    if (!shouldShowPlaceholder) return;
    setTimeout(() => {
      if (!getPlceholderEl()) {
        highlight?.appendChild(el);
      }
    }, 100);
  }

  // If the input is not focused, add the placeholder
  if (document.activeElement !== input) {
    handleBlur();
  }

  input?.addEventListener('focus', handleFocus);
  input?.addEventListener('blur', handleBlur);
  return () => {
    input?.removeEventListener('focus', handleFocus);
    input?.removeEventListener('blur', handleBlur);
  };
}
