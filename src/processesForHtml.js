import path from 'path';
import cheerio from 'cheerio';
import url from 'url';

const findProcessForResources = (html, tag) => {
  const $ = cheerio.load(html);
  const processes = {
    link: 'href',
    img: 'src',
    script: 'src',
  };
  const process = atr => $(atr).map((i, el) => $(el).attr(processes[tag]))
    .get().filter(u => url.parse(u).protocol === null);
  return process(tag);
};

export const findResources = html => (
  {
    links: findProcessForResources(html, 'link'),
    scripts: findProcessForResources(html, 'script'),
    images: findProcessForResources(html, 'img'),
  }
);

export const changeHtml = (html, dirName) => {
  const $ = cheerio.load(html);
  const keys = [['link', 'href'], ['script', 'src'], ['img', 'src']];
  keys.forEach(([key, src]) => {
    $(key).each(function processElement() {
      if ($(this).attr(src) !== undefined && url.parse($(this).attr(src)).protocol === null) {
        const pathBefore = $(this).attr(src).split('/').slice(-1)
          .join('');
        const pathAfter = path.resolve(dirName, pathBefore).split('/').slice(-2).join('/');
        $(this).attr(src, pathAfter);
      }
    });
  });
  return $.html();
};
