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

getCrawler.getData = async (inputCategory, option = '추천순') => {
  let titleList = [];
  const resultList = await getHTML(inputCategory).then((html) => {
    try {
      const $ = cheerio.load(html.data);
      const bodyList = $('div.SubhomeList_list__3D7S6').children('a');

      bodyList.each(function (i, elem) {
        titleList[i] = {
          title: $(this).text(),
        };
      });
    } catch (error) {
      throw new Error('crawling error');
    }

    return orderByResult(titleList, option);
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
  if (option == '추천순') {
    let rankingList = [];
    //각 순위별 리스트를 모은뒤 5순위까지만 자른다.
    const ratings = selectRatings(titleList);
    rankingList.push(ratings.slice(0, 5));

    const price = selectPrice(titleList);
    rankingList.push(price.slice(0, 5));

    const discount = selectDiscount(titleList);
    rankingList.push(discount.slice(0, 5));

    const review = selectReview(titleList);
    rankingList.push(review.slice(0, 5));

    let cnt = 0;
    let tmp = 1;
    let totalList = [];
    //하나의 배열로 합친다.
    for (let i = 0; i < rankingList.length; i++) {
      for (let j = 0; j < 5; j++) {
        // console.log('for-rankingList : ', rankingList[i][j]);
        totalList.push(rankingList[i][j]);
      }
    }

    //반복되는 횟수 추출
    const result = totalList.reduce((accu, curr) => {
      // console.log('accu', accu);
      accu[curr.title] = (accu[curr.title] || 0) + 1;
      return accu;
    }, {});

    const keys = Object.keys(result);
    let finalList = [];
    for (let i = 0; i < keys.length; i++) {
      // console.log(keys[i], result[keys[i]]);
      const count = result[keys[i]];
      switch (count) {
        case 0:
          finalList.push({ title: '5 - ' + keys[i] });
          break;
        case 1:
          finalList.push({ title: '4 - ' + keys[i] });
          break;
        case 2:
          finalList.push({ title: '3 - ' + keys[i] });
          break;
        case 3:
          finalList.push({ title: '2 - ' + keys[i] });
          break;
        case 4:
          finalList.push({ title: '1 - ' + keys[i] });
          break;
      }
    }

    const final = finalList.sort((a, b) => {
      const A = Object.keys(a)[0];
      const B = Object.keys(b)[0];
      return B - A;
    });
    console.log('final', final);

    return final;
  } else {
    return titleList;
  }
}

function selectRatings(titleList) {
  // console.log('selectRatings---', titleList);
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
