import {chromium} from 'playwright';

export async function capture(url: string): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: {width: 1200, height: 630},
    deviceScaleFactor: 2,
    // colorScheme: 'dark',
  });

  const page = await context.newPage();

  await page.goto(url, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(200);

  const buffer = await page.screenshot({
    type: 'png',
    fullPage: false,
  });

  await browser.close();
  return buffer;
}
