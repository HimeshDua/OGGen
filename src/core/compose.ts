import sharp from 'sharp';
import fs from 'fs/promises';
import type {Theme} from './themes.js';

interface ComposeOptions {
  screenshot: Buffer;
  output: {og: string; host: string};
  width: number;
  height: number;
  theme: Theme;
  title?: string;
  badge?: string;
  textColor?: string;
  themeMode: 'light' | 'dark';
  gridStyle?: 'light' | 'dark';
  compactMode?: boolean;
}

const LINE_HEIGHT = 64;
const FONT_SIZE = 48;

export async function compose(opts: ComposeOptions): Promise<void> {
  const {width, height} = opts;
  const compact = opts.compactMode ?? false;
  const fillColor =
    opts.textColor && opts.textColor !== 'auto' ? opts.textColor : opts.theme.textColor;
  // const isLight = fillColor === '#ffffff' || fillColor === 'white';

  // const badgeStroke = isLight ? 'rgba(255,255,255,0.55)' : 'rgba(3,3,3,0.65)';
  const badgeStroke =
    opts.themeMode === 'dark' ? opts.theme.highlightColor : `${opts.theme.highlightColor}20`;

  const gridPattern = opts.theme.grid
    ? `
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none"
        stroke="rgba(${opts.gridStyle === 'light' ? '255,255,255' : '0,0,0'},0.15)"
        stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />`
    : '';

  // === 1. GRADIENT + GRID (single SVG) ===
  const gradientSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="${opts.theme.gradient[0]}"/>
          <stop offset="50%"  stop-color="${opts.theme.gradient[1]}"/>
          <stop offset="100%" stop-color="${opts.theme.gradient[2]}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      ${gridPattern}
    </svg>`;

  let canvas = sharp(Buffer.from(gradientSvg));

  // === 2. DARK TINT ===
  const tintSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black" opacity="0.07"/>
    </svg>`;

  canvas = canvas.composite([{input: Buffer.from(tintSvg), blend: 'multiply'}]);

  // === 3. CONTENT OVERLAYS ===
  const overlays: sharp.OverlayOptions[] = [];

  // --- Badge pill ---
  if (opts.badge) {
    // ~10.5px per char at font-size 20 + 56px total horizontal padding
    const pillW = Math.max(160, Math.ceil(opts.badge.length * 10.5) + 56);
    const pillH = 42;
    const pillX = Math.floor(width / 2 - pillW / 2);
    const pillY = 44;
    const textY = pillY + pillH / 2 + 5.5; // +1 optical correction

    const badgeSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="${pillX}" y="${pillY}"
          rx="21" ry="21"
          width="${pillW}" height="${pillH}"
          fill="${opts.theme.highlightColor}24"
          stroke="${badgeStroke}"
          stroke-width="1.2"
        />
        <text
          x="50%"
          y="${textY}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="${fillColor}"
          font-size="19"
          font-family="inter, ui-sans-serif, system-ui, sans-serif"
          font-weight="500"
          letter-spacing="0.2">
          ${escapeXML(opts.badge)}
        </text>
      </svg>`;
    overlays.push({input: Buffer.from(badgeSvg)});
  }

  // --- Title ---
  if (opts.title) {
    const lines = compact ? [opts.title] : wrapTitle(opts.title, 36);
    const lineCount = lines.length;

    // In non-compact: start higher so multi-line block feels centered above card
    const blockHeight = lineCount * LINE_HEIGHT;
    const startY = compact
      ? opts.badge
        ? 170
        : 140
      : opts.badge
        ? 158
        : Math.max(110, 158 - Math.floor((lineCount - 1) * LINE_HEIGHT * 0.4));

    const tspans = lines
      .map((line, i) => {
        const y = startY + i * LINE_HEIGHT;
        return `<text
          x="50%"
          y="${y}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="${fillColor}"
          font-size="${FONT_SIZE}"
          font-weight="700"
          font-family="inter, ui-sans-serif, system-ui, sans-serif"
          letter-spacing="-1.2">
          ${escapeXML(line)}
        </text>`;
      })
      .join('\n');

    const titleSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${tspans}
      </svg>`;
    overlays.push({input: Buffer.from(titleSvg)});
  }

  // === 4. SCREENSHOT CARD ===
  const cardWidth = 1000;
  const cardHeight = 520;
  const cardLeft = Math.floor((width - cardWidth) / 2);

  const titleLines = opts.title ? wrapTitle(opts.title, 36).length : 0;
  const cardTop = compact ? 240 : 248 + Math.max(0, titleLines - 1) * LINE_HEIGHT;

  const maskSvg = `
    <svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${cardWidth}" height="${cardHeight}" rx="14" ry="14" fill="white"/>
    </svg>`;

  const screenshotResized = await sharp(opts.screenshot)
    .resize(cardWidth, cardHeight, {fit: 'cover', position: 'top'})
    .toBuffer();

  const screenshotRounded = await sharp(screenshotResized)
    .composite([{input: Buffer.from(maskSvg), blend: 'dest-in'}])
    .png()
    .toBuffer();

  const glowSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="${cardLeft - 6}" y="${cardTop - 6}"
        rx="26" ry="26"
        width="${cardWidth + 12}" height="${cardHeight + 12}"
        fill="rgba(255,255,255,0.07)"
      />
    </svg>`;

  overlays.push({input: Buffer.from(glowSvg)});
  overlays.push({input: screenshotRounded, top: cardTop, left: cardLeft});

  await fs.mkdir(`OG/${opts.output.host}`, {recursive: true});
  const outputPath = `OG/${opts.output.host}/${opts.output.og}`;
  await canvas.composite(overlays).png().toFile(outputPath);
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapTitle(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}
