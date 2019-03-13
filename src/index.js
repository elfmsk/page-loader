import path from 'path';
import axios from 'axios';
// import cheerio from 'cheerio';
// import url from 'url';
import { promises as fs } from 'fs';
import _ from 'lodash/fp';

import findResources from './findResources';


const downloadFile = (urlLoc, pathForFile) => axios.get(urlLoc)
  .then(response => fs.writeFile(pathForFile, response.data, 'utf8'))
  .then(() => fs.readFile(pathForFile, 'utf-8'))
  .then(data => data);

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

const downloadPage = (urlLoc, pathBase) => {
  const fileName = `${_.kebabCase(urlLoc.split('//').slice(1).join(''))}.html`;
  const pathForFile = path.resolve(pathBase, fileName);
  const dirName = `${_.kebabCase(urlLoc.split('//').slice(1).join(''))}_files`;
  const pathForResources = path.resolve(pathBase, dirName);

  downloadFile(urlLoc, pathForFile)
    .then(html => findResources(html))
    .then(resources => downloadResources(urlLoc, resources, pathForResources));
};

export default downloadPage;
