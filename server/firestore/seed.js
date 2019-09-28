const db = require('./index');
const cheerio = require('cheerio');
const axios = require('axios');

// let docRef = db.collection('brands').doc('alovelace');

// let setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 4815,
// });

// let aTuringRef = db.collection('users').doc('aturing');

// let setAlan = aTuringRef.set({
//   first: 'Alan',
//   middle: 'Mathison',
//   last: 'Turing',
//   born: 1912,
// });

//add brand to database
const addBrand = (name, store1, store2, store3, store4, store5, store6) => {
  return db
    .collection('brands')
    .doc(name)
    .set({
      name: name,
      sephora: store1 ? store1 : false,
      ulta: store2 ? store2 : false,
      glowieco: store3 ? store3 : false,
      sokoglam: store4 ? store4 : false,
      yesstyle: store5 ? store5 : false,
      kollectionk: store6 ? store6 : false,
    });
};

const sephora = async () => {
  return axios('https://www.sephora.com/brands-list')
    .then(res => {
      const html = res.data;
      const $ = cheerio.load(html);
      const sephoraBrands = $('.css-kxa5od').map((i, element) => {
        const name = $(element).text();
        return name;
      });
      // console.log(sephoraBrands);
      return sephoraBrands;
    })
    .catch(console.error);
};

// const ulta = async () => {
//   return axios('https://www.ulta.com/global/nav/allbrands.jsp')
//     .then(res => {
//       const html = res.data;
//       const $ = cheerio.load(html);
//       // let allBrands = [];
//       const ultaBrands = $(
//         '.first_column, .second_column, .third_column, .fourth_column'
//       ).map((i, element) => {
//         const cleaned = $(element).map((i, el) => {
//           const text = $(el)
//             .text()
//             .replace(/\n/g, '')
//             .trim()
//             .split(/\t/g);

//           for (let i = 0; i < text.length; i++) {
//             text[i].trim();
//           }

//           let results = text.filter(word => word.length > 2);
//           // console.log(results);
//           return results;
//         });
//         // console.log(cleaned[0]);
//         // allBrands.concat(cleaned);
//         // console.log(allBrands);
//         return cleaned;
//       });
//       console.log(ultaBrands[0].initialize);
//       return ultaBrands;
//     })
//     .catch(console.error);
// };

// const scrapeBrands = async () = {
//   return axios('https://www.sephora.com/brands-list').then(res => {
//     const $ = cheerio.load(res.data);
//     const brands = test;
//   }).catch(console.error)
// };

// const brands = sephora();
// brands.then(items => {
//   items.map((i, element) => {
//     addBrand(element, true);
//   });
// });
ulta();

// console.log(brands);
