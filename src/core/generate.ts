import {capture} from './capture.js';
import {compose} from './compose.js';
import {getTheme} from './themes.js';
import {buildFilename} from '../utils/filename.js';

export interface GenerateOptions {
  url: string;
  theme: string;
  output?: string;
  width: number;
  height: number;
}

export async function generate(opts: GenerateOptions): Promise<string> {
  const theme = getTheme(opts.theme);

  const screenshot = await capture(opts.url);

  const output = opts.output ?? buildFilename(opts.url);

  await compose({
    screenshot,
    output,
    width: opts.width,
    height: opts.height,
    theme,
  });

  return output;
}
