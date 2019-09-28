const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../firestore/index');

router.get('/', async (req, res, next) => {
  try {
    let data = [];
    const result = await axios.get('https://www.sephora.com/brands-list');
    const $ = await cheerio.load(result.data);
    const returnEl = $('.css-kxa5od').each((i, element) => {
      let name = $(element).text();
      data[i] = name + ',';
    });
    console.log($(returnEl).text());
    res.send(data);

    // const sephoraBrands = $('.css-kxa5od').map((i, element) => {
    //   const name = $(element).text();
    //   return { name };
    // });
    // // return sephoraBrands;
    // res.send(sephoraBrands);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
