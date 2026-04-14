import chalk from 'chalk';
import {chromium} from 'playwright';

export async function capture(
  url: string,
  browserTheme: GenerateOptions['browserTheme']
): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: {width: 1200, height: 630},
    deviceScaleFactor: 2,
    colorScheme: browserTheme,
  });

  const page = await context.newPage();
  try {
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    const buffer = await page.screenshot({
      type: 'png',
      fullPage: false,
    });
    return buffer;
  } finally {
    console.log(chalk.cyan('Closing Browser window..'));
    await browser.close();
  }
}
