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

module.exports = router;
