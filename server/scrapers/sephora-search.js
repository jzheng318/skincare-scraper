const db = require('../firestore/index');
const cheerio = require('cheerio');
const axios = require('axios');

//document to flesh out the axios call for scraping search results on sephora
//sephora api json can be found by going through network calls
//MVP: only first page of search results will be shown

//created a product class in case we want to manipulate data later (sales data!!!)
// class Product {
//   constructor(obj) {
//     this.brand = obj.brandName;
//     this.price = obj.currentSku.listPrice;
//     this.product = obj.productName;
//     this.rating = obj.rating;
//     this.url = obj.targetUrl;
//     // this.otherInfo = obj.currentSku;
//   }
// }

const sephoraSearch = async keyword => {
  if (keyword.includes(' ')) {
    keyword.replace(' ', '%20');
  }
  let sephoraProducts = {};
  return axios(
    `https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=1`
  )
    .then(res => {
      const products = res.data.products;

      //sometimes sephora search results will redirect to the brand page.
      // to avoid this, we're adding another conditional:
      if (products) {
        return products.map(product => {
          sephoraProducts[product.productName] = {
            brand: product.brandName,
            product: product.productName,
            price: product.currentSku.listPrice,
            rating: product.rating,
            url: `www.sephora.com${product.targetUrl}`,
            // this.otherInfo = obj.currentSku;
          };
          // console.log(sephoraProducts);

          //products will return all the data for that particular product
          //sephoraProducts will return the condensed view
          return sephoraProducts;
        });
        // return sephoraProducts;
      } else {
        console.log('nothing new here, your redirect went wrong');
        return;
      }
    })
    .catch(console.error);
};

sephoraSearch('skincare');

module.exports = { sephoraSearch };
