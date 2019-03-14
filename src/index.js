import path from 'path';
import axios from 'axios';
import debug from 'debug';
import { promises as fs } from 'fs';
import _ from 'lodash/fp';
import { findResources, changeHtml } from './processesForHtml';

const logInfo = debug('page-loader:info');
const logRequest = debug('page-loader:request');

const downloadFile = (urlLoc, pathForFile) => {
  logRequest('Requesting', urlLoc);
  return axios.get(urlLoc)
    .then(response => fs.writeFile(pathForFile, response.data, 'utf8'))
    .then(() => fs.readFile(pathForFile, 'utf-8'));
};

const downloadResources = (urlLoc, resources, pathForResources) => {
  const urlAndResourceName = _.keys(resources).filter(n => resources[n].length !== 0)
    .reduce((acc, e) => [...acc, ...resources[e]
      .map(tail => (
        {
          urlPath: new URL(tail, urlLoc).href,
          resourceName: path.resolve(pathForResources, tail.split('/').splice(-1).join('')),
        }
      ))], []);
  const promises = urlAndResourceName
    .map(actualUrl => downloadFile(actualUrl.urlPath, actualUrl.resourceName));

  return fs.mkdir(pathForResources)
    .then(() => Promise.all(promises));
};

const makeName = (urlLoc, extension) => `${_.kebabCase(urlLoc.split('//').slice(1)
  .join(''))}${extension}`;

const downloadPage = (urlLoc, pathBase) => {
  const fileName = makeName(urlLoc, '.html');
  const pathForFile = path.resolve(pathBase, fileName);
  const dirName = makeName(urlLoc, '_files');
  const pathForResources = path.resolve(pathBase, dirName);
  let newHtml;
  downloadFile(urlLoc, pathForFile)
    .then((html) => {
      logInfo('findResources');
      newHtml = changeHtml(html, dirName);
      return findResources(html);
    })
    .then(resources => downloadResources(urlLoc, resources, pathForResources))
    .then(() => {
      logInfo('changeHtml');
      return fs.writeFile(pathForFile, newHtml, 'utf8');
    });
};

export default downloadPage;
