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

    const result = await axios
      .get(
        `https://recommender.scarabresearch.com/merchants/158FA252C01D4F78/?pv=662303900&xp=1&f=f%3APERSONAL%2Cl%3A192%2Co%3A0&cv=1&ca=&q=${keyword}&cp=1&vi=6F58C70693163312&prev_url=https%3A%2F%2Fwww.yesstyle.com%2Fen%2Fkorean-beauty-cosmetics&ti=2%2C2548%2C1932%2C1928%2C%2C%7Cl%2C%2C1824%2C1824%2C1824%2C%2C1843%2C1846%2C1852%2C%2C%7Cr%2C%2C2560%2C2560%2C2560%2C2560%2C2567%2C2643%2C2646%2C3136%2C2556`
      )
      .then(res => {
        let data = [];
        const schema = res.data.schema;
        //products is an object where each key is the item
        const products = res.data.products;

        for (let key in products) {
          let item = products[key];
          let catEnd = item[6].lastIndexOf('>FD|Beauty');
          //yesstyle products have a boolean for when its available
          if (item[7]) {
            // console.log('item exists');
            data.push({
              product: item[1],
              price: item[8],
              image: item[5],
              category: item[6].substring(0, catEnd),
              url: item[2],
            });
          }
        }
        return data;
      });
    res.send(result);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
