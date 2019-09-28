const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');

router.get('/', async (req, res, next) => {
  try {
    let data = [];
    const result = await axios.get(
      'https://www.ulta.com/global/nav/allbrands.jsp'
    );
    const $ = await cheerio.load(result.data);
    const array = $(
      '.first_column, .second_column, .third_column, .fourth_column'
    ).map((i, element) => {
      $(element).each((i, el) => {
        const text = $(el)
          .text()
          .replace(/\n/g, '')
          .trim()
          .split(/\t/g);
        //   const name = text
        //     .replace(/\n/g, '')
        //     .trim()
        //     .split(/\t/g);
        //   let brandArray = name.trim().split(/\t/g);

        for (let i = 0; i < text.length; i++) {
          text[i].trim();
        }

        let results = text.filter(word => word.length > 2);

        data = data.concat(results);
      });
    });
    console.log(array);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
