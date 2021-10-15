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

getCrawler.getData = async (inputCategory, option) => {
  let titleList = [];
  const resultList = await getHTML(inputCategory).then((html) => {
    const $ = cheerio.load(html.data);
    const bodyList = $('div.SubhomeList_list__3D7S6').children('a');

    bodyList.each(function (i, elem) {
      titleList[i] = {
        title: $(this).text(),
      };
    });
    orderByResult(titleList, option);
    return titleList;
  });
  return resultList;
};

function orderByResult(titleList, option) {
  if (option == '리뷰순') {
    selectReview(titleList);
  }
  if (option == '평점순') {
    selectRatings(titleList);
  }
  if (option == '할인율') {
    selectDiscount(titleList);
  }
  if (option == '가격순') {
    selectPrice(titleList);
  }
  if (option == '추천해주세요') {
    let rankingList = [];
    const ratings = selectRatings(titleList);
    const price = selectPrice(titleList);
    const discount = selectDiscount(titleList);
    const review = selectReview(titleList);

    rankingList.push(ratings);
    rankingList.push(price);
    rankingList.push(discount);
    rankingList.push(review);
    console.log('rankingList---', rankingList);
  }
}

function selectRatings(titleList) {
  // console.log('selectRatings---');
  return titleList.sort((a, b) => {
    const reg = /\d\.\d\(/g;
    const tmpA = a.title.match(reg);
    const tmpB = b.title.match(reg);

    const A = tmpA[0].replace('(', '').replace('.', '');
    const B = tmpB[0].replace('(', '').replace('.', '');

    return B - A;
  });
}

function selectPrice(titleList) {
  return titleList.sort((a, b) => {
    const cutListA = a.title.slice(-10, a.title.length);
    const cutListB = b.title.slice(-10, b.title.length);

    const reg = /(\d*\,\d{3}|\d*\,\d*\,\d{3})/g;
    const tmpA = cutListA.match(reg);
    const tmpB = cutListB.match(reg);

    const A = tmpA[0].replace(',', '');
    const B = tmpB[0].replace(',', '');

    return A - B;
  });
}

function selectDiscount(titleList) {
  return titleList.sort((a, b) => {
    const reg = /(\d{2})\%/g;
    const tmpA = a.title.match(reg);
    const tmpB = b.title.match(reg);

    const A = tmpA ? tmpA[0].replace(/\%/g, '') : '0';
    const B = tmpB ? tmpB[0].replace(/\%/g, '') : '0';

    return B - A;
  });
}

function selectReview(titleList) {
  return titleList.sort((a, b) => {
    // const startIndexA = a.title.indexOf('(') + 1;
    // const endIndexA = a.title.indexOf(')');
    // const A = a.title.substring(startIndexA, endIndexA).replace(',', '');

    // const startIndexB = b.title.indexOf('(') + 1;
    // const endIndexB = b.title.indexOf(')');
    // const B = b.title.substring(startIndexB, endIndexB).replace(',', '');

    const reg = /\((\d*\,\d*|\d{1,3})\)/g;
    const tmpA = a.title.match(reg);
    const tmpB = b.title.match(reg);

    const A = tmpA[0].replace('(', '').replace(')', '').replace(',', '');
    const B = tmpB[0].replace('(', '').replace(')', '').replace(',', '');

    return B - A;
  });
}

module.exports = getCrawler;
