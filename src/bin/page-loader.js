#!/usr/bin/env node

import commander from 'commander';
import downloadPage from '..';
import { version } from '../../package.json';

commander
  .version(version, '-v, --version')
  .arguments('<url>')
  .description('third project from Hexlet')
  .option('-o, --output [dir]', 'output directory (default is current)', process.cwd())
  .action(url => downloadPage(url, commander.output)
    .then(() => `Page loaded in ${commander.output}`)
    .catch(console.log))
  .parse(process.argv);
