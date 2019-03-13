import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import url from 'url';
import { promises as fs } from 'fs';
import _ from 'lodash/fp';


const loadingFile = (urlLoc, pathForFile) => axios.get(urlLoc)
  .then(response => fs.writeFile(pathForFile, response.data, 'utf8'))
  .then(() => fs.readFile(pathForFile, 'utf-8'))
  .then(data => data);

const loadingResources = (urlLoc, resources, pathForResources) => {
  const urlAndResourceName = _.keys(resources).filter(n => resources[n].length !== 0)
    .reduce((acc, e) => [...acc, ...resources[e]
      .map(tail => (
        {
          urlPath: new URL(tail, urlLoc).href,
          resourceName: path.resolve(pathForResources, tail.split('/').splice(-1).join('')),
        }
      ))], []);

  return fs.mkdir(pathForResources)
    .then(() => urlAndResourceName
      .map(actualUrl => loadingFile(actualUrl.urlPath, actualUrl.resourceName)));
};

const findResources = (html) => {
  const $ = cheerio.load(html);
  const linksArr = $('link').map((i, el) => $(el).attr('href'))
    .get().filter(u => url.parse(u).protocol === null);
  const scriptsArr = $('script').map((i, el) => $(el).attr('src'))
    .get().filter(u => url.parse(u).protocol === null);
  const imagesArr = $('img').map((i, el) => $(el).attr('src'))
    .get().filter(u => url.parse(u).protocol === null);

  return {
    links: linksArr,
    scripts: scriptsArr,
    images: imagesArr,
  };
};

const downloadFiles = (urlLoc, pathBase) => {
  const fileName = `${_.kebabCase(urlLoc.split('//').slice(1).join(''))}.html`;
  const pathForFile = path.resolve(pathBase, fileName);
  const dirName = `${_.kebabCase(urlLoc.split('//').slice(1).join(''))}_files`;
  const pathForResources = path.resolve(pathBase, dirName);

  loadingFile(urlLoc, pathForFile)
    .then(html => findResources(html))
    .then(resources => loadingResources(urlLoc, resources, pathForResources));
};

export default downloadFiles;
