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
      const brands = [];
      const html = res.data;
      const $ = cheerio.load(html);
      const array = $('.all-brands-sublisting').map((i, element) => {
        const el = $(element)
          .children() //shows all children of all-brands-sublisting
          .children() //pointing to the uls
          .map((i, ul) => {
            //loop through each ul
            const columns = $(ul)
              .children() //looking at the li in each column
              .map((i, name) => {
                //for each li
                const a = $(name)
                  .text()
                  .trim();
                // .then(res => {
                brands.push(a);
                // });
                // console.log('BRANDS:', brands);
                // return a;
              });
            // return columns[0];
          });
        // return el;
      });
      // console.log(brands);
      return brands;
    })
    .catch(console.error);
};

ulta();
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
        // console.log(name);
        return name;
      });
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

const scrapeUlta = () => {
  ulta().then(items => {
    items.map(element => {
      addBrand(element.toUpperCase(), 'ulta');
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
          addBrand(val.toUpperCase(), site)
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
const main = async function(array) {
  await scrapeSephora();
  await scrapeUlta();
  await scrapeShopify(array);
  await scrapeYesstyle();
};

main(shopifySites);
