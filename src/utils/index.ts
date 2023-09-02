export function formatDate(dateValue: string | Date | undefined) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (date.toDateString() === 'Invalid Date') return String(dateValue);

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const pluralize = (
  count: number | null | undefined,
  noun: string | null | undefined,
  suffix = 's'
) => {
  if (!count || !noun) {
    return '';
  }
  return `${count} ${noun}${count > 1 ? suffix : ''}`;
};
