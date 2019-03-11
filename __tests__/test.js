import path from 'path';
import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import downloadFile from '../src';

const pathToExpectedFile = path.resolve(__dirname, '__fixtures__/hexlet-io-courses.html');

let timeDir;
beforeAll(async () => {
  timeDir = await fs.mkdtemp(path.join(__dirname, os.tmpdir()));
});

test('downloadFile', async () => {
  nock('http://hexlet.io')
    .get('/courses')
    .replyWithFile(200, pathToExpectedFile);

  await downloadFile('http://hexlet.io/courses', timeDir);

  const expected = await fs.readFile(pathToExpectedFile, 'utf8');
  const result = await fs.readFile(`${timeDir}/hexlet-io-courses.html`, 'utf8');

  expect(expected).toEqual(result);
});
