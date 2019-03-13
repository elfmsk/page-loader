import cheerio from 'cheerio';
import url from 'url';

const findProcessForResources = (html, tag) => {
  const $ = cheerio.load(html);
  const processes = [
    {
      check: key => key === 'link',
      process: () => $('link').map((i, el) => $(el).attr('href'))
        .get().filter(u => url.parse(u).protocol === null),
    },
    {
      check: key => key === 'script',
      process: () => $('script').map((i, el) => $(el).attr('src'))
        .get().filter(u => url.parse(u).protocol === null),
    },
    {
      check: key => key === 'img',
      process: () => $('img').map((i, el) => $(el).attr('src'))
        .get().filter(u => url.parse(u).protocol === null),
    },
  ];
  const getObject = key => processes
    .find(({ check }) => check(key));
  return getObject(tag).process();
};

const findResources = html => (
  {
    links: findProcessForResources(html, 'link'),
    scripts: findProcessForResources(html, 'script'),
    images: findProcessForResources(html, 'img'),
  }
);
export default findResources;
