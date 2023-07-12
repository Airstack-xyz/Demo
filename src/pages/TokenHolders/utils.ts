export function getDAppType(name: string) {
  if (name.includes('lens')) {
    return 'lens';
  }

  if (name.includes('farcaster')) {
    return 'farcaster';
  }

  return '';
}
