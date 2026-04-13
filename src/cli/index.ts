import {Command} from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import {generate} from '../core/generate.js';
import {getTheme, getThemes} from '../core/themes.js';

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
      console.log(chalk.cyan('\n  oggen — OG image generator\n'));

      // --- theme ---
      let theme = opts.theme;
      if (!theme) {
        const res = await prompts({
          type: 'select',
          name: 'theme',
          message: 'Select a theme',
          choices: getThemes().map(t => ({title: t, value: t})),
        });
        theme = res.theme;
        if (!theme) process.exit(0);
      }

      const themeData = getTheme(theme);

      // --- content ---
      const {title} = await prompts({
        type: 'text',
        name: 'title',
        message: 'Title (optional)',
      });

      const {badge} = await prompts({
        type: 'text',
        name: 'badge',
        message: 'Badge text (optional)  e.g. himeshdua.vercel.app',
      });

      // --- text color ---
      const {textColor} = await prompts({
        type: 'select',
        name: 'textColor',
        message: 'Title & badge color',
        choices: [
          {title: 'Auto  (picks based on theme)', value: 'auto'},
          {title: 'Black', value: '#0a0a0a'},
          {title: 'White', value: '#ffffff'},
        ],
      });

      // --- grid options (only if theme uses grid) ---
      let gridStyle: 'light' | 'dark' = 'dark';
      if (themeData.grid) {
        const res = await prompts({
          type: 'select',
          name: 'gridStyle',
          message: 'Grid line color',
          choices: [
            {title: 'Dark  (for light backgrounds)', value: 'dark'},
            {title: 'Light (for dark backgrounds)', value: 'light'},
          ],
        });
        gridStyle = res.gridStyle ?? 'dark';
      }

      // --- layout ---
      const {compactMode} = await prompts({
        type: 'confirm',
        name: 'compactMode',
        message: 'Compact layout?  (locks card position, disables text wrap & spacing expansion)',
        initial: false,
      });

      const file = await generate({
        url: opts.url,
        theme,
        title: title?.trim() || undefined,
        badge: badge?.trim() || undefined,
        textColor: textColor ?? 'auto',
        gridStyle,
        compactMode: compactMode ?? false,
        width: Number(opts.width),
        height: Number(opts.height),
      });

      console.log(chalk.green(`\n  ✓ Saved: ${file}\n`));
    } catch (err) {
      console.error(chalk.red('Error:'), err);
      process.exit(1);
    }
  });

program.parse();
