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
    return titleList;
  });
  return resultList;
};

module.exports = getCrawler;
