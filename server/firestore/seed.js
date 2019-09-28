const db = require('./index');
const cheerio = require('cheerio');
const axios = require('axios');

//add brand to database
function addBrand(name, storeName) {
  return db
    .collection('brands')
    .doc(name)
    .set(
      {
        name: name,
        // sephora: storeName === 'sephora' ? true : false,
        // ulta: storeName === 'ulta' ? true : false,
        // glowieco: storeName === 'glowieco' ? true : false,
        // sokoglam: storeName === 'sokoglam' ? true : false,
        // yesstyle: storeName === 'yesstyle' ? true : false,
        // kollectionk: storeName === 'kollectionk' ? true : false,
        [`${arguments[1]}`]: true,
      },
      { merge: true }
    );
}

const checkBrand = async name => {
  // console.log('checkbrand:', name);
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
        const name = $(element)
          .text()
          // .replace('.', ' ')
          .trim();
        return name;
      });
      // console.log(sephoraBrands);
      return sephoraBrands;
    })
    .catch(console.error);
};

//shopify sites
const shopify = async website => {
  return axios(`https://${website}.com/products.json`).then(res => {
    const products = res.data.products;
    const sgBrands = products.map(item => {
      let name = item.vendor.trim();
      if (name[name.length - 1] === '.') {
        name = name.slice(0, name.length - 1);
      }
      return name;
    });
    let sgSet = new Set(sgBrands);
    return sgSet;
  });
};

//ulta
const ulta = async () => {
  return axios('https://www.ulta.com/global/nav/allbrands.jsp')
    .then(res => {
      const html = res.data;
      const $ = cheerio.load(html);
      let allBrands = [];
      const ultaBrands = $(
        '.first_column, .second_column, .third_column, .fourth_column'
      ).map((i, element) => {
        const cleaned = $(element).map((i, el) => {
          const text = $(el)
            .text()
            .replace(/\n/g, '')
            .trim()
            .split(/\t/g);

          for (let i = 0; i < text.length; i++) {
            text[i].trim();
          }

          let results = text.filter(word => word.length > 2);
          // console.log(results);
          return results;
        });
        // console.log(cleaned[0]);
        // allBrands.concat(cleaned);
        // console.log(allBrands);
        return cleaned;
      });
      console.log(cleaned);
      return allBrands.concat(ultaBrands);
    })
    .catch(console.error);
};

// ulta();

const yesstyle = async () => {
  return axios(
    'https://www.yesstyle.com/en/brands/list.html/bpt.300?badid=14072'
  )
    .then(res => {
      const html = res.data;
      const $ = cheerio.load(html);
      const ysBrands = $('.md-button.transit').map((i, element) => {
        const name = $(element)
          .children()
          .text();
        // .text()
        // .trim();
        console.log(name);
        return name;
      });

      // const ysBrands = $('.brandListSection').map((i, element) => {
      //   const tag = $(element)
      //     .children()
      //     .next()
      //     // .html();
      //     //this is the div containing hrefs?
      //     .map((i, el) => {
      //       const url = $(el)
      //         // .attr('href')
      //         .text();
      //       console.log('URL:', url);
      //     });
      //   return tag;
      // });
      // console.log(tag);

      // console.log(ysBrands);
      return ysBrands;
    })
    .catch(console.error);
};

// yesstyle();

//loading data inside cloud firestorage
const scrapeSephora = () => {
  sephora().then(items => {
    items.map((i, element) => {
      addBrand(element.toUpperCase(), 'sephora');
    });
  });
};

let shopifySites = [
  'sokoglam',
  'glowieco',
  'oo35mm',
  'kollectionk',
  'peachandlily',
];

const scrapeShopify = async array => {
  array.forEach(site => {
    shopify(site).then(items => {
      items.forEach(
        val =>
          // checkBrand(val.toUpperCase()).then(res => {
          //   console.log(site, 'is currently looking at brand ', val);
          // console.log(res);
          // console.log(res[site]);
          addBrand(val.toUpperCase(), site)
        // if (!res.size) {
        //   addBrand(val, site);
        //   console.log(site, ':brand:', val, 'has been added');
        // } else {
        //   console.log('this site does not exist in the entry');
        //   addBrand(val, site);
        //   // let setup = brand.set({ [`${site}`]: true }, { merge: true });

        //   // console.log(brand.get().data());
        //   // } else {
        //   //   console.log('this brand already exists in our database:');
        //   //   console.log(res.site);
        // }
        // })
        // );
      );
    });
  });
};

const scrapeYesstyle = () => {
  yesstyle().then(items => {
    items.map((i, element) => {
      addBrand(element.toUpperCase(), 'yesstyle');
    });
  });
};

// calling functions to sync database
// const main = async function(array) {
//   await scrapeSephora();
//   await scrapeShopify(array);
//   await scrapeYesstyle();
// };

// main(shopifySites);
