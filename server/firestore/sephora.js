const axios = require('axios');
const cheerio = require('cheerio');

//query to find all brands at sephora based off of their all brands page
let sephoraList = [];

class Brand {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}
// let brandObj = {
//   name: '',
//   url: '',
// };

function getBrands() {
  let sephoraBrands = [];
  axios('https://www.sephora.com/brands-list')
    .then(res => {
      const html = res.data;
      const $ = cheerio.load(html);
      $('.css-kxa5od').each((i, element) => {
        let name = $(element).text();

        // let url = element.attribs.href;
        let url = $(element).attr('href');
        console.log(name);
        //   brandObj.name = name;
        //   brandObj.url = url;

        //   sephoraList[i] = brandObj;
        //   console.log(sephoraList[i]);
        //
        // let brand = new Brand(name, url);
        // sephoraList.push(brand);
        sephoraBrands.push(name);
      });
      // console.log(sephoraBrands);
      return sephoraBrands;
    })
    .catch(console.error);
}
//query for searches
let keyword = 'foundation';

if (keyword.includes(' ')) {
  keyword.replace(' ', '%20');
}

class Product {
  constructor(obj) {
    this.brand = obj.brandName;
    this.price = obj.currentSku.listPrice;
    this.product = obj.productName;
    this.rating = obj.rating;
    this.url = obj.targetUrl;
    // this.otherInfo = obj.currentSku;
  }
}

let sephora = {};
axios(
  `https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=1`
)
  .then(res => {
    const products = res.data.products;
    products.map(product => {
      sephora[product.productName] = new Product(product);
    });
    // console.log(sephora);
  })
  .catch(console.error);

//querying by type:

//skincare first:
axios(
  `https://www.sephora.com/api/catalog/search?type=keyword&q=skincare&content=true&includeRegionsMap=true&page=60&currentPage=1`
)
  .then(res => {
    const products = res.data.products;
    products.map(product => {
      sephora[product.productName] = new Product(product);
    });
    // console.log(sephora);
  })
  .catch(console.error);

getBrands();

module.exports = { sephora, sephoraList, getBrands };
