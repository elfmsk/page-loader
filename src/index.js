import path from 'path';
import axios from 'axios';
import { promises as fs } from 'fs';
import _ from 'lodash/fp';


const downloadFile = (url, pathBase) => {
  const fileName = `${_.kebabCase(url.split('//').slice(1).join(''))}.html`;
  const pathForFile = path.resolve(pathBase, fileName);
  return axios.get(url)
    .then(response => fs.writeFile(pathForFile, response.data, 'utf8'))
    .catch((error) => {
      throw error;
    });
};

export default downloadFile;
