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

//takes in both the site and the word you're searching for
const shopifySearch = async (site, keyword) => {
  if (keyword.includes(' ')) {
    keyword.replace(' ', '%20');
  }
  let siteProducts = {};
  return axios
    .get(`https://${site}.com/products.json?limit=250`)
    .then(res => {
      const allProducts = res.data.products;
      const search = allProducts.filter(
        item => item.handle.includes(keyword) || item.tags.includes(keyword)
      );
      search.forEach(item => {
        siteProducts[item.title] = {
          brand: item.vendor,
          product: item.title,
          price: item.variants[0].price,
          image: item.images[0].src,
          tags: item.tags,
          size: item.variants[0].grams,
        };
      });
      console.log(siteProducts);
      return siteProducts;
    })
    .catch(console.error);
};

shopifySearch('sokoglam', 'AHA');

// ,
