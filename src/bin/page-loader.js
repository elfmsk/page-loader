#!/usr/bin/env node

import commander from 'commander';
import downloadFile from '..';
import path from 'path';
import { version } from '../../package.json';

const pathBases = (pathname = '') => path.resolve(process.cwd(), pathname);

commander
  .version(version, '-v, --version')
  .arguments('<url>')
  .description('third project from Hexlet')
  .option('-o, --output [dir]', 'Output dir')
  .action((url) => {
    downloadFile(url, pathBases(commander.output));
  })
  .parse(process.argv);
