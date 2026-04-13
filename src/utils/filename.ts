export function buildFilename(url: string): {og: string; host: string} {
  const host = new URL(url).hostname.replace('www.', '');
  const route = new URL(url).pathname.split('/').filter(Boolean).join('-') || 'index';
  return {og: `${route}.png`, host};
}
