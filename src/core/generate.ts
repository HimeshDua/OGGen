import {capture} from './capture.js';
import {compose} from './compose.js';
import {getTheme} from './themes.js';
import {buildFilename} from '../utils/filename.js';

export async function generate(opts: GenerateOptions): Promise<string> {
  const theme = getTheme(opts.theme);
  const screenshot = await capture(opts.url, opts.browserTheme);
  const output = buildFilename(opts.url);

  await compose({
    ...opts,
    screenshot,
    theme,
    output,
  });

  return `OG/${output.host}/${output.og}`;
}
