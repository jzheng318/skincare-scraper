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
function addBrand(name, storeName) {
  // console.log(arguments[1]);
  return db
    .collection('brands3')
    .doc(name)
    .set({
      name: name,
      sephora: storeName === 'sephora' ? true : false,
      ulta: storeName === 'ulta' ? true : false,
      glowieco: storeName === 'glowieco' ? true : false,
      sokoglam: storeName === 'sokoglam' ? true : false,
      yesstyle: storeName === 'yesstyle' ? true : false,
      kollectionk: storeName === 'kollectionk' ? true : false,
    });
}
// const addBrand = (name, storeName) => {
//   return db
//     .collection('brands2')
//     .doc(name)
//     .set({
//       name: name,
//       // sephora: storeName === 'sephora' ? true : false,
//       // ulta: storeName === 'ulta' ? true : false,
//       // glowieco: storeName === 'glowieco' ? true : false,
//       // sokoglam: storeName === 'sokoglam' ? true : false,
//       // yesstyle: storeName === 'yesstyle' ? true : false,
//       // kollectionk: storeName === 'kollectionk' ? true : false,
//       arguments[1]: true,
//     });
// };

const checkBrand = async name => {
  console.log('checkbrand: ', name);
  return db
    .collection('brands')
    .where('name', '==', name)
    .get();
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

//shopify sites
const sokoglam = async () => {
  return axios('https://sokoglam.com/products.json').then(res => {
    const products = res.data.products;
    const sgBrands = products.map(item => {
      const name = item.vendor;
      // console.log(name);
      return name;
    });
    // console.log(sgBrands);
    // return sgBrands;
    let sgSet = new Set(sgBrands);
    // console.log(sgSet);
    return sgSet;
  });
};

const shopify = async website => {
  return axios(`https://${website}.com/products.json`).then(res => {
    const products = res.data.products;
    const sgBrands = products.map(item => {
      const name = item.vendor;
      // console.log(name);
      return name;
    });
    // console.log(sgBrands);
    // return sgBrands;
    let sgSet = new Set(sgBrands);
    // console.log(sgSet);
    return sgSet;
  });
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

const scrapeSephora = () => {
  sephora().then(items => {
    items.map((i, element) => {
      addBrand(element.toUpperCase(), 'sephora');
    });
  });
};

let shopifySites = [
  'sokoglam',
  // 'glowieco',
  // 'oo35mm',
  // 'kollectionk',
  // 'peachandlily',
];

// sokoglam.then(items => {
//   items.forEach(val =>
//     checkBrand(val).then(res => {
//       if (!res.size) {
//         addBrand(val, false, false, true);
//         console.log('brand:', val, 'has been added');
//       } else {
//         res.update({ site: true });
//       }
//     })
//   );
// });

const scrapeShopify = async array => {
  array.forEach(site => {
    const data = shopify(site).then(items => {
      // console.log('currently working on ', site);
      console.log(items);
      items.forEach(val =>
        checkBrand(val.toUpperCase()).then(res => {
          // console.log(site, 'is currently looking at brand ', val);
          // console.log(res);
          if (!res.size) {
            addBrand(val, site);
            console.log(site, ':     brand:', val, 'has been added');
          } else if (!res[site]) {
            console.log('this site does not exist in the entry');
            let brand = db.collection('brands').doc(val);
            brand.update({ [`${site}`]: true });
            console.log(brand[site]);
          } else {
            console.log('this brand already exists in our database:');
            console.log(res.site);
          }
        })
      );
    });
  });
};

const main = async function(array) {
  await scrapeSephora();
  await scrapeShopify(array);
};

main(shopifySites);
// console.log(brands);
