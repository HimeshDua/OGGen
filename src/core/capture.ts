import {chromium} from 'playwright';

export async function capture(url: string): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({width: 1200, height: 680});

  await page.goto(url, {waitUntil: 'networkidle'});
  await page.evaluate(() => document.fonts.ready);

  // await page.waitForLoadState('networkidle');

  const buffer = await page.screenshot({fullPage: false});

  await browser.close();
  return buffer;
}
