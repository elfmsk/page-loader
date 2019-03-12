#!/usr/bin/env node

import commander from 'commander';
import downloadFiles from '..';
import { version } from '../../package.json';

commander
  .version(version, '-v, --version')
  .arguments('<url>')
  .description('third project from Hexlet')
  .option('-o, --output [dir]', 'Output dir', process.cwd())
  .action((url) => {
    downloadFiles(url, commander.output);
  })
  .parse(process.argv);
