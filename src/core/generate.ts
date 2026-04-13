import {capture} from './capture.js';
import {compose} from './compose.js';
import {getTheme} from './themes.js';
import {buildFilename} from '../utils/filename.js';

export interface GenerateOptions {
  url: string;
  theme: string;
  title?: string;
  badge?: string;
  width: number;
  height: number;
}

export async function generate(opts: GenerateOptions): Promise<string> {
  const theme = getTheme(opts.theme);

  const screenshot = await capture(opts.url);

  const output = buildFilename(opts.url);

  const {height, badge, title, width} = opts;
  await compose({
    screenshot,
    output,
    width,
    height,
    theme,
    title,
    badge,
  });

  return `OG/${output.host}/${output.og}`;
}
