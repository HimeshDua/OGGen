import sharp from 'sharp';
import fs from 'fs/promises';
import type {Theme} from './themes.js';

interface ComposeOptions {
  screenshot: Buffer;
  output: string;
  width: number;
  height: number;
  theme: Theme;
}

export async function compose(opts: ComposeOptions): Promise<void> {
  const {width, height} = opts;

  const gradient = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${opts.theme.gradient[0]}"/>
          <stop offset="50%" stop-color="${opts.theme.gradient[1]}"/>
          <stop offset="100%" stop-color="${opts.theme.gradient[2]}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `;

  const base = sharp(Buffer.from(gradient));

  let canvas = base;

  if (opts.theme.grid) {
    const grid = `
      <svg width="${width}" height="${height}">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-opacity="0.05"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `;
    canvas = canvas.composite([{input: Buffer.from(grid)}]);
  }

  const resized = await sharp(opts.screenshot).resize(1000, 560, {fit: 'cover'}).png().toBuffer();

  await canvas
    .composite([
      {
        input: resized,
        top: Math.floor((height - 560) / 2),
        left: Math.floor((width - 1000) / 2),
      },
    ])
    .png()
    .toFile(opts.output);
}
