import {Command} from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import {generate} from '../core/generate.js';
import {getThemes} from '../core/themes.js';

const program = new Command();

program.name('oggen').description('Generate OG images from URLs').version('0.1.0');

program
  .command('generate')
  .requiredOption('--url <string>')
  .option('--theme <string>')
  .option('--width <number>', 'Width', '1200')
  .option('--height <number>', 'Height', '630')
  .action(async opts => {
    try {
      console.log(chalk.cyan('Generating OG image...'));

      let theme = opts.theme;
      let title: string = opts.title?.trim() || null;
      let badge: string = opts.badge?.trim() || null;

      if (!theme) {
        const themes = getThemes();
        const selectedTheme = await prompts({
          type: 'select',
          name: 'theme',
          message: 'Select a theme',
          choices: themes.map(t => ({
            title: t,
            value: t,
          })),
        });

        theme = selectedTheme.theme;
      }

      if (!title) {
        title = (await prompts({type: 'text', name: 'title', message: 'Add a title (optional)'}))
          .title;
      }

      if (!badge) {
        badge = (
          await prompts({
            type: 'text',
            name: 'badge',
            message: 'Add a Badge (optional) eg: himeshdua.vercel.app',
          })
        ).badge;
      }

      const file = await generate({
        url: opts.url,
        theme,
        title,
        badge,
        width: Number(opts.width),
        height: Number(opts.height),
      });

      console.log(chalk.green(`Saved: ${file}`));
    } catch (err) {
      console.error(chalk.red('Error:'), err);
      process.exit(1);
    }
  });

program.parse();
