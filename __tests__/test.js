import path from 'path';
import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import downloadFiles from '../src';

const fsExtra = require('fs-extra');

const pathToExpectedFile = path.resolve(__dirname, '__fixtures__/sitesedona-github-io.html');

let timeDir;
beforeAll(async () => {
  timeDir = await fs.mkdtemp(path.join(__dirname, os.tmpdir()));
});

// test('downloadFile', async () => {
//   nock('https://sitesedona.github.io')
//     .get('/')
//     .replyWithFile(200, pathToExpectedFile);
//
//   await downloadFiles('https://sitesedona.github.io', timeDir);
//
//   const expected = await fs.readFile(pathToExpectedFile, 'utf8');
//   const result = await fs.readFile(`${timeDir}/sitesedona-github-io.html`, 'utf8');
//
//   expect(expected).toEqual(result);
// });
//
// afterAll(async () => {
//   // await fsExtra.remove(timeDir);
// });

test('downloadFile', async () => {
  // nock('https://sitesedona.github.io')
  //   .get('/courses')
  //   .replyWithFile(200, pathToExpectedFile);

  await downloadFiles('https://sitesedona.github.io', timeDir);

  // const expected = await fs.readFile(pathToExpectedFile, 'utf8');
  // const result = await fs.readFile(`${timeDir}/hexlet-io-courses.html`, 'utf8');

  // expect(expected).toEqual(result);
});

afterAll(async () => {
  // await fsExtra.remove(timeDir);
});
