const axios = require('axios');
const cheerio = require('cheerio');

async function getHTML(category) {
  let cate = '';
  switch (category) {
    case '호텔':
      cate = 'hotel';
      break;
    case '펜션':
      cate = 'pension';
      break;
  }

  try {
    return await axios.get(`https://www.yanolja.com/${cate}`);
  } catch (error) {
    console.error(error);
  }
}

const getCrawler = {};

getCrawler.getData = async (inputCategory) => {
  let titleList = [];
  const resultList = await getHTML(inputCategory).then((html) => {
    const $ = cheerio.load(html.data);
    const bodyList = $('div.SubhomeList_list__3D7S6').children('a');

    bodyList.each(function (i, elem) {
      titleList[i] = {
        title: $(this).text(),
      };
    });
    orderByResult(titleList);
    return titleList;
  });
  return resultList;
};

function orderByResult(titleList, option = '리뷰순') {
  if (option == '리뷰순') {
    titleList.sort((a, b) => {
      const startIndexA = a.title.indexOf('(') + 1;
      const endIndexA = a.title.indexOf(')');
      const A = a.title.substring(startIndexA, endIndexA).replace(',', '');

      const startIndexB = b.title.indexOf('(') + 1;
      const endIndexB = b.title.indexOf(')');
      const B = b.title.substring(startIndexB, endIndexB).replace(',', '');

      // const reg = /\((\d*\,\d*|\d)\)/g;
      // const A = a.title.match(reg);
      // const B = b.title.match(reg);

      // return A < B ? -1 : A > B ? 1 : 0;

      return B - A;
    });
  }
}

module.exports = getCrawler;
