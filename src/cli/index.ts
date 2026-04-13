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
      console.log(chalk.cyan('\n  oggen — OG image generator\n'));

      // Theme
      const theme =
        opts.theme ||
        (
          await prompts({
            type: 'select',
            name: 'theme',
            message: 'Select a theme',
            choices: getThemes().map(t => ({title: t, value: t})),
          })
        ).theme;

      if (!theme) process.exit(0);

      // Inputs
      const {title, badge} = await prompts([
        {type: 'text', name: 'title', message: 'Title (optional)'},
        {type: 'text', name: 'badge', message: 'Badge (optional)'},
      ]);

      const {textColor} = await prompts({
        type: 'select',
        name: 'textColor',
        message: 'Text color',
        choices: [
          {title: 'Auto', value: 'auto'},
          {title: 'Black', value: '#0a0a0a'},
          {title: 'White', value: '#ffffff'},
        ],
        initial: 0,
      });

      const {showGrid} = await prompts({
        type: 'toggle',
        name: 'showGrid',
        message: 'Grid overlay?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      });

      const {compactMode} = await prompts({
        type: 'confirm',
        name: 'compactMode',
        message: 'Compact layout?',
        initial: true,
      });

      const file = await generate({
        url: opts.url,
        theme,
        title: title?.trim(),
        badge: badge?.trim(),
        textColor,
        showGrid,
        compactMode,
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
