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

export function formatAddress(address: string, type?: string) {
  if (!address) {
    return address;
  }
  switch (type) {
    case 'farcaster':
      return address.startsWith('fc_fname:') ? address : `fc_fname:${address}`;
    case 'lens':
      return address.startsWith('lens/') ? address : `lens/${address}`;
  }
  return address;
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
