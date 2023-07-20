export function formatNumber(number: number): string {
  if (number === 0) return '0';

  if (number < 1) {
    const fixedNumner = number.toFixed(3);
    return fixedNumner === '0.000' ? '0.001' : fixedNumner;
  }

  number = Math.trunc(number);

  if (number >= 1e12) {
    // If the number is in trillions
    return (number / 1e12).toFixed(0) + 'T';
  } else if (number >= 1e9) {
    // If the number is in billions
    return (number / 1e9).toFixed(0) + 'B';
  } else if (number >= 1e6) {
    // If the number is in millions
    return (number / 1e6).toFixed(0) + 'M';
  } else if (number >= 1e3) {
    // If the number is in thousands
    return (number / 1e3).toFixed(0) + 'K';
  } else {
    // If the number is less than 1000, no need to add K, M, B, or T
    return number.toString();
  }
}
