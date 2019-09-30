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
    let yesStyleProducts = {};
    let productArray = [];
    const result = await axios.get(
      `https://www.yesstyle.com/en/list.html?q=${keyword}&bpt=48`
    );
    const $ = await cheerio.load(result.data);
    const html = $('.itemContainer').map((i, element) => {
      // console.log('~~~~~~~NEW ITEM~~~~~~~~~~');
      const itemContainer = $(element);
      const itemStatus = itemContainer
        .children()
        .children('.itemMostPopular.flex-auto');
      const discount = itemContainer
        .children()
        .children('.itemDiscount.flex-auto');
      // console.log($(discount).text());
      // return discount;
      const itemUrl = $('.itemContainer a').attr('href');

      const itemName = itemContainer
        .children()
        .next()
        .children('.itemTitle')
        .text();

      let sepIdx = itemName.indexOf(' - ');
      let brandName = itemName.slice(0, sepIdx);
      const itemPrice = itemContainer
        .children()
        .next()
        .children('.itemPrice')
        .text();

      let price = itemPrice.slice(4);

      const itemImg = itemContainer
        .children()
        .next() //a tag
        .children() //children of a tag
        .children('img')
        .attr('src');

      const itemRating = itemContainer
        .children()
        .next() //a tag
        .children() //children of a tag
        .next() //itemTitle
        .next() //itemPrice
        .next()
        .children('.icon.colored')
        .attr('ng-style');

      //shows up as {{::ratingPercent(93.10000000000001)}}
      let starRating;
      if (itemRating) {
        let rating = parseFloat(itemRating.slice(18, 23));
        starRating = rating / 25;
      } else {
        starRating = null;
      }

      // console.log(starRating);

      const numRating = itemContainer
        .children()
        .next() //a tag
        .children() //children of a tag
        .next() //itemTitle
        .next() //itemPrice
        .next()
        .children('.reviewCount')
        .text();
      // .attr('ng-style');
      // console.log(numRating);

      yesStyleProducts[itemName] = {
        brand: brandName,
        product: itemName,
        image: itemImg,
        price: price,
        rating: starRating,
        numRatings: numRating,
        url: itemUrl,
        store: 'YesStyle',
        exclusive: false,
      };

      productArray.push(yesStyleProducts[itemName]);
    });
    // console.log(yesStyleProducts);
    res.send(productArray);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
