import fs from 'fs/promises';
import {Command} from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import {generate} from '../core/generate.js';
import {getThemes} from '../core/themes.js';
import pLimit from 'p-limit';

const program = new Command();
const limit = pLimit(3);

program.name('oggen').description('Generate OG images from BATCH').version('0.1.0');

program
  .requiredOption('--input <path>', 'JSON file with OG configs')
  .option('--theme <string>')
  .option('--width <number>', 'Width', '1200')
  .option('--height <number>', 'Height', '630')
  .action(async opts => {
    try {
      const inputPath = `routes/${opts.input}`;

      console.log(chalk.cyan('\n  oggen — Batch generator\n'));

      const {browserTheme} = await prompts({
        type: 'select',
        name: 'browserTheme',
        message: 'Select browser theme mode (affects screenshot appearance)',
        choices: [
          {title: 'Light', selected: true, value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
      });

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

      const raw = await fs.readFile(inputPath, 'utf-8');
      const items: {
        url: string;
        title?: string;
        badge?: string;
      }[] = JSON.parse(raw);

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Invalid input file. Must be a non-empty array.');
      }

      console.log(chalk.yellow(`\n  Generating ${items.length} OG images...\n`));

      const results = await Promise.all(
        items.map(item =>
          limit(() =>
            generate({
              browserTheme,
              url: item.url,
              theme,
              title: item.title?.trim(),
              badge: item.badge?.trim(),
              textColor,
              showGrid,
              compactMode,
              width: Number(opts.width),
              height: Number(opts.height),
            })
          )
        )
      );

      results.forEach(file => {
        console.log(chalk.green(`  ✓ ${file}`));
      });

      console.log(chalk.cyan('\n  Done.\n'));
    } catch (err) {
      console.error(chalk.red('Error:'), err);
      process.exit(1);
    }
  });

program.parse();
