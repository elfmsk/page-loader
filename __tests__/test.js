import path from 'path';
import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import downloadFiles from '../src';

const pathToBaseFile = path.resolve(__dirname, '__fixtures__/sitesedona-github-io.html');
const pathToLogoPng = path.resolve(__dirname, '__fixtures__/sitesedona-github-io_files/logo.png');
const pathToMainCss = path.resolve(__dirname, '__fixtures__/sitesedona-github-io_files/main.css');
const pathToMapPng = path.resolve(__dirname, '__fixtures__/sitesedona-github-io_files/map.png');
const pathToNormalize = path.resolve(__dirname, '__fixtures__/sitesedona-github-io_files/normalize.css');
const pathToWelcomePng = path.resolve(__dirname, '__fixtures__/sitesedona-github-io_files/welcome.png');

let timeDir;
beforeAll(async () => {
  timeDir = await fs.mkdtemp(path.join(__dirname, os.tmpdir()));

  nock('https://sitesedona.github.io')
    .get('/')
    .replyWithFile(200, pathToBaseFile);
  nock('https://sitesedona.github.io')
    .get('/img/logo.png')
    .replyWithFile(200, pathToLogoPng);
  nock('https://sitesedona.github.io')
    .get('/css/main.css')
    .replyWithFile(200, pathToMainCss);
  nock('https://sitesedona.github.io')
    .get('/img/map.png')
    .replyWithFile(200, pathToMapPng);
  nock('https://sitesedona.github.io')
    .get('/css/normalize.css')
    .replyWithFile(200, pathToNormalize);
  nock('https://sitesedona.github.io')
    .get('/img/welcome.png')
    .replyWithFile(200, pathToWelcomePng);

  await downloadFiles('https://sitesedona.github.io', timeDir);
});

it('downloadBase', async () => {
  const expected = await fs.readFile(pathToBaseFile, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io.html`, 'utf8');
  expect(expected).toEqual(result);
});
it('downloadLogo', async () => {
  const expected = await fs.readFile(pathToLogoPng, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io_files/logo.png`, 'utf8');
  expect(expected).toEqual(result);
});
it('downloadMainCss', async () => {
  const expected = await fs.readFile(pathToMainCss, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io_files/main.css`, 'utf8');
  expect(expected).toEqual(result);
});
it('downloadMapPng', async () => {
  const expected = await fs.readFile(pathToMapPng, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io_files/map.png`, 'utf8');
  expect(expected).toEqual(result);
});
it('downloadNormalize', async () => {
  const expected = await fs.readFile(pathToNormalize, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io_files/normalize.css`, 'utf8');
  expect(expected).toEqual(result);
});
it('downloadWelcomePng', async () => {
  const expected = await fs.readFile(pathToWelcomePng, 'utf8');
  const result = await fs.readFile(`${timeDir}/sitesedona-github-io_files/welcome.png`, 'utf8');
  expect(expected).toEqual(result);
});
