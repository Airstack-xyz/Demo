export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (date.toDateString() === 'Invalid Date') return dateString;

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

export function capitalizeFirstLetter(str: string) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
}
