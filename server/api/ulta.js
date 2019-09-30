const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');

//routes for getting all brands
router.get('/', async (req, res, next) => {
  try {
    let data = [];
    const result = await axios.get(
      'https://www.ulta.com/global/nav/allbrands.jsp'
    );
    const $ = await cheerio.load(result.data);

    const array = $('.all-brands-sublisting').map((i, element) => {
      const el = $(element);
      const letter = el
        .children()
        .eq(0)
        .text();
      //   console.log(letter);

      const nameLi = el
        .children()
        .children()
        .map((i, text) => {
          const columns = $(text)
            .children()
            .map((i, name) => {
              const a = $(name)
                .text()
                .trim();
              data.push(a);
            });
        });
    });

    res.send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

