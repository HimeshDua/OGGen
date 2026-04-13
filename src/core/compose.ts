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
}

export async function compose(opts: ComposeOptions): Promise<void> {
  const {width, height} = opts;

  const gridPattern = opts.theme.grid
    ? `
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
`
    : '';

  // === 1. GRADIENT BACKGROUND ===
  const gradientSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${opts.theme.gradient[0]}"/>
          <stop offset="50%"  stop-color="${opts.theme.gradient[1]}"/>
          <stop offset="100%" stop-color="${opts.theme.gradient[2]}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
          ${gridPattern}
    </svg>
  `;

  let canvas = sharp(Buffer.from(gradientSvg));
  const baseLayers: sharp.OverlayOptions[] = [];

  // === 2. GRID OVERLAY ===
  // if (opts.theme.grid) {
  //   const gridSvg = `
  //   <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  //     <defs>
  //       <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
  //         <path d="M 40 0 L 0 0 0 40" fill="blue" stroke="#EE4B2B" stroke-width="1"/>
  //       </pattern>
  //     </defs>
  //     <rect width="${width}" height="${height}" fill="url(#grid)" />
  //   </svg> `;
  //   baseLayers.push({input: Buffer.from(gridSvg), blend: 'atop'});
  // }

  // === 3. DARK TINT (depth) ===
  const tintSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black" opacity="0.08"/>
    </svg>
  `;
  baseLayers.push({input: Buffer.from(tintSvg), blend: 'multiply'});

  canvas = canvas.composite(baseLayers);

  // === 4. CONTENT OVERLAYS ===
  const overlays: sharp.OverlayOptions[] = [];

  // --- Badge pill ---
  if (opts.badge) {
    const pillW = Math.max(300, opts.badge.length * 14 + 80);
    const pillX = Math.floor(width / 2 - pillW / 2);

    const badgeSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="${pillX}" y="40"
          rx="25" ry="25"
          width="${pillW}" height="40"
          fill="transparent"
          stroke="#030303c2"
          stroke-width="1"
        />
        <text
          x="50%" y="70"
          text-anchor="middle"
          fill="#030303"
          font-size="20"
          font-family="inter, ui-sans-serif, system-ui, sans-serif"
          font-weight="500">
          ${escapeXML(opts.badge)}
        </text>
      </svg>
    `;
    overlays.push({input: Buffer.from(badgeSvg)});
  }

  // --- Title (wraps across multiple lines if needed) ---
  if (opts.title) {
    // const lines = wrapTitle(opts.title, 38);
    // const lineHeight = 86;
    const startY = opts.badge ? 165 : 130;
    const textElement = `<text
          x="50%" y="${startY}"
          text-anchor="middle"
          fill="black"
          font-size="48"
          font-weight="700"
          font-family="inter, ui-sans-serif, system-ui, sans-serif"
          letter-spacing="-1">
          ${escapeXML(opts.title)}
        </text>`;

    // const textElements = lines
    //   .map((line, i) => {
    //     const y = startY + i * lineHeight;
    //     return `<text
    //       x="50%" y="${y}"
    //       text-anchor="middle"
    //       fill="black"
    //       font-size="48"
    //       font-weight="700"
    //       font-family="inter, ui-sans-serif, system-ui, sans-serif"
    //       letter-spacing="-1">
    //       ${escapeXML(line)}
    //     </text>`;
    //   })
    //   .join('\n');
    // oh yes hemss!!

    const titleSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${textElement}
      </svg>
    `;
    overlays.push({input: Buffer.from(titleSvg)});
  }

  // === 5. SCREENSHOT CARD ===
  const cardWidth = 1000;
  const cardHeight = 520;

  const titleLines = opts.title ? wrapTitle(opts.title, 38).length : 0;
  const hasBadge = Boolean(opts.badge);
  const cardTop = 240 + Math.max(0, titleLines - 1) * 86 + (hasBadge ? 0 : 0);
  const cardLeft = Math.floor((width - cardWidth) / 2);

  // Rounded-corner mask applied to the screenshot
  const maskSvg = `
    <svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${cardWidth}" height="${cardHeight}" rx="12" ry="12" fill="white"/>
    </svg>
  `;

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
        x="${cardLeft - 4}" y="${cardTop - 4}"
        rx="24" ry="24"
        width="${cardWidth + 8}" height="${cardHeight + 8}"
        fill="rgba(255,255,255,0.08)"
      />
    </svg>
  `;
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
  return lines.slice(0, 3); // max 3 lines
}
