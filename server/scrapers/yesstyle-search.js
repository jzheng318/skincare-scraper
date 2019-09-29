const db = require('../firestore/index');
const cheerio = require('cheerio');
const axios = require('axios');

//document to flesh out the axios call for scraping search results on sephora
//yesstyle api json can be found by going through network calls
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

const yesstyleSearch = async keyword => {
  if (keyword.includes(' ')) {
    keyword.replace(' ', '%20');
  }
  let yesstyleProducts = {};
  return axios
    .get(
      `https://recommender.scarabresearch.com/merchants/158FA252C01D4F78/?pv=662303900&xp=1&f=f%3APERSONAL%2Cl%3A192%2Co%3A0&cv=1&ca=&q=${keyword}&cp=1&vi=6F58C70693163312&prev_url=https%3A%2F%2Fwww.yesstyle.com%2Fen%2Fkorean-beauty-cosmetics&ti=2%2C2548%2C1932%2C1928%2C%2C%7Cl%2C%2C1824%2C1824%2C1824%2C%2C1843%2C1846%2C1852%2C%2C%7Cr%2C%2C2560%2C2560%2C2560%2C2560%2C2567%2C2643%2C2646%2C3136%2C2556`
    )
    .then(res => {
      //   let data = [];
      //   const schema = res.data.schema;
      //products is an object where each key is the item
      const products = res.data.products;

      for (let key in products) {
        let item = products[key];
        let catEnd = item[6].lastIndexOf('>FD|Beauty');
        //yesstyle products have a boolean for when its available
        if (item[7]) {
          yesstyleProducts[item[1]] = {
            product: item[1],
            price: item[8],
            image: item[5],
            category: item[6].substring(0, catEnd),
            url: item[2],
          };
        }
      }
      return yesstyleProducts;
    })
    .catch(console.error);
};
yesstyleSearch('etude house');
