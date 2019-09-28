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
    // const array = $(
    //   '.first_column, .second_column, .third_column, .fourth_column'
    // ).map((i, element) => {
    //   $(element).each((i, el) => {
    //     const text = $(el)
    //       .text()
    //       .replace(/\n/g, '')
    //       .trim()
    //       .split(/\t/g)
    //       .filter(word => word.length > 2);

    //     data = data.concat(text);
    //   });
    // });
    // console.log(array);

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

// let allBrands = [];
// const ultaBrands = $(
//   '.first_column, .second_column, .third_column, .fourth_column'
// ).map((i, element) => {
//   const cleaned = $(element).map((i, el) => {
//     const text = $(el)
//       .text()
//       .replace(/\n/g, '')
//       .trim()
//       .split(/\t/g)
//       .filter(word => word.length > 1);

//     // console.log(text);
//     return text;
//   });
//   // console.log(cleaned);
//   // console.log(cleaned[0]);
//   // allBrands.concat(cleaned);
//   // console.log(allBrands);
//   return allBrands.concat(cleaned);
// });
// console.log(allBrands);
// return allBrands.concat(ultaBrands)
