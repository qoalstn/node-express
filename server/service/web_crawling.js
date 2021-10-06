const axios = require('axios');
const cheerio = require('cheerio');

async function getHTML(category) {
  const cate = category == '호텔' ? 'hotel' : '';
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
  // console.log(resultList);
  return resultList;
};

module.exports = getCrawler;
