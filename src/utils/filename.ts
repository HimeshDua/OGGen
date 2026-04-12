export function buildFilename(url: string): string {
  const host = new URL(url).hostname.replace('www.', '');
  return `og-${host}.png`;
}
