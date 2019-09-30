const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../firestore/index');

router.get('/', async (req, res, next) => {
  try {
    let data = [];
    const result = await axios.get(
      'https://www.yesstyle.com/en/brands/list.html/bpt.300?badid=14072'
    );
    const $ = await cheerio.load(result.data);
    const returnEl = $('.md-button.transit').each((i, element) => {
      let name = $(element)
        .children()
        .text();
      data.push(name);
    });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:keyword', async (req, res, next) => {
  try {
    const keyword = req.params.keyword;

    const result = await axios.get(
      `https://www.yesstyle.com/en/list.html?q=${keyword}&bpt=48`
    );
    const $ = await cheerio.load(result.data);
    const html = $('.itemContainer').map((i, element) => {
      const itemContainer = $(element);
      const itemStatus = itemContainer
        .children()
        .children('.itemMostPopular.flex-auto');
      const discount = itemContainer
        .children()
        .children('.itemDiscount.flex-auto');
      // console.log($(discount).text());
      // return discount;
      const itemInfo = itemContainer.children('a');
      console.log(itemInfo);
      // const url = itemInfo.attr('href');
      // console.log($(url).html());

      // const itemImg= itemInfo.children('img')
      // console.log(${itemImg}.html)
    });
    // .then(res => {
    // let data = [];
    // const schema = res.data.schema;
    // //products is an object where each key is the item
    // const products = res.data.products;

    // for (let key in products) {
    //   let item = products[key];
    //   let catEnd = item[6].lastIndexOf('>FD|Beauty');
    //   //yesstyle products have a boolean for when its available
    //   if (item[7]) {
    //     // console.log('item exists');
    //     data.push({
    //       product: item[1],
    //       price: item[8],
    //       image: item[5],
    //       category: item[6].substring(0, catEnd),
    //       url: item[2],
    //     });
    // //   }
    // }
    // return data;

    // });
    res.send('complete');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
