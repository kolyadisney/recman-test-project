export const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const isWordChar = (ch: string) => /\p{L}|\p{N}/u.test(ch);

const getWordStarts = (text: string): number[] => {
  const starts: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (isWordChar(text[i]) && (i === 0 || !isWordChar(text[i - 1]))) {
      starts.push(i);
    }
  }
  return starts;
};

export const isPrefixMatch = (text: string, query: string): boolean => {
  const q = (query ?? '').trim();
  if (!q) return true;
  const lc = text.toLowerCase();
  const qlc = q.toLowerCase();
  for (const start of getWordStarts(text)) {
    if (lc.startsWith(qlc, start)) return true;
  }
  return false;
};

export const highlightSearchTerm = (source: string, query: string): string => {
  const q = (query ?? '').trim();
  if (!q) return escapeHtml(source);

  const src = source;
  const lc = src.toLowerCase();
  const qlc = q.toLowerCase();

  const ranges: Array<[number, number]> = [];
  for (const start of getWordStarts(src)) {
    if (lc.startsWith(qlc, start)) {
      ranges.push([start, Math.min(start + q.length, src.length)]);
    }
  }
  if (ranges.length === 0) return escapeHtml(src);

  let html = '';
  let last = 0;
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
    if (start > last) html += escapeHtml(src.slice(last, start));
    html += `<mark>${escapeHtml(src.slice(start, end))}</mark>`;
    last = end;
  }
  if (last < src.length) html += escapeHtml(src.slice(last));
  return html;
};
