import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import url from 'url';
import { promises as fs } from 'fs';
import _ from 'lodash/fp';


const loadingFile = (url, pathForFile) => axios.get(url)
  .then(response => fs.writeFile(pathForFile, response.data, 'utf8'))
  .then(() => fs.readFile(pathForFile, 'utf-8'))
  .then(data => data);

const loadingResources = (resources, pathForResources) => {
    fsPromises.mkdir(pathForResources).
    then(n => console.log(n));
}

const findResources = (html) => {
  const $ = cheerio.load(html);
  const linksArr = $('link').map((i, el) => {
    return $(el).attr('href');
  }).get().filter(u => url.parse(u).protocol === null);
  const scriptsArr = $('script').map((i, el) => {
    return $(el).attr('src');
  }).get().filter(u => url.parse(u).protocol === null);
  const imagesArr = $('img').map((i, el) => {
    return $(el).attr('src');
  }).get().filter(u => url.parse(u).protocol === null);

  return {
    'links': linksArr,
    'scripts': scriptsArr,
    'images': imagesArr
  }
};

const downloadFiles = (url, pathBase) => {
  const fileName = `${_.kebabCase(url.split('//').slice(1).join(''))}.html`;
  const pathForFile = path.resolve(pathBase, fileName);
  const dirName = `${_.kebabCase(url.split('//').slice(1).join(''))}_files`;
  const pathForResources = path.resolve(pathBase, dirName);

  loadingFile(url, pathForFile)
  .then(html => findResources(html))
  .then(resources => loadingResources(resources, pathForResources))
};

export default downloadFiles;
