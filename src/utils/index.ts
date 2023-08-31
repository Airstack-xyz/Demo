export function formatDate(dateValue: string | Date) {
  const date = new Date(dateValue);
  if (date.toDateString() === 'Invalid Date') return String(dateValue);

  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
