#!/usr/bin/env node

import commander from 'commander';
import downloadPage from '..';
import errors from 'errno';
import { version } from '../../package.json';

commander
  .version(version, '-v, --version')
  .arguments('<url>')
  .description('third project from Hexlet')
  .option('-o, --output [dir]', 'output directory (default is current)', process.cwd())
  .action((url) => {
    downloadPage(url, commander.output)
      .then(() => console.log(`Page loaded in ${commander.output}`))
      .catch((e) => {
        if (errors.code[e.code]) {
          console.error(errors.code[e.code].description);
        } else {
          console.error(e.message);
        }
        process.exit(1);
      });
  })
  .parse(process.argv);
