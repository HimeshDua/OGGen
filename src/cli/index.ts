import {Command} from 'commander';
import chalk from 'chalk';
import {generate} from '../core/generate.js';

const program = new Command();

program.name('oggen').description('Generate OG images from URLs').version('0.1.0');

program
  .command('generate')
  .requiredOption('--url <string>')
  .option('--theme <string>', 'Theme name', 'dark-grid')
  .option('--output <string>', 'Output file')
  .option('--width <number>', 'Width', '1200')
  .option('--height <number>', 'Height', '630')
  .action(async opts => {
    try {
      console.log(chalk.cyan('Generating OG image...'));

      const file = await generate({
        url: opts.url,
        theme: opts.theme,
        output: opts.output,
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
