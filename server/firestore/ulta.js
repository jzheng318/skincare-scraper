const axios = require('axios');
const cheerio = require('cheerio');

//query to find all brands at sephora based off of their all brands page
let ultaList = [];

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

let ultaBrands = [];
axios('https://www.ulta.com/global/nav/allbrands.jsp')
  .then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const allDivs = $(
      '.first_column, .second_column, .third_column, .fourth_column'
    ).each((i, element) => {
      let text = element.children[1].children[0].children[0].data;
      let name = text.slice(text.lastIndexOf('\t') + 1);
      let urlText = element.children[1].children[0].attribs.href;
      let url = urlText.slice(2);

      //   console.log(typeof urlText);
      let brand = new Brand(name, url);
      ultaList.push(brand);
      ultaBrands.push(name);
      //   console.log(ultaList[i]);

      //   console.log(allDivs.text());
    });
    // console.log(allDivs[0].children[1].children[0].children[0].data);
  })
  .catch(console.error);

//to scrape ulta brands, change brand name in url and search for productQvContainer

module.exports = { ultaList, ultaBrands };
//by search information?
//spaces should be updated to %20
// let search = 'cleanser';

// if (search.includes(' ')) {
//   search.replace(' ', '%20');
// }

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

// let ulta = {};

// axios(
//   `https://www.ulta.com/ulta/a/_/Ntt-${search}/Nty-1?Dy=1&ciSelector=searchResults`
// )
//   .then(res => {
//     const html = res.data;
//     const $ = cheerio.load(html);
//     const products = $('.prod-desc');
//     // const products = $('#foo16').html();
//     // const itemName = $('.prod-title').each((i, element) => {
//     //   let omg = $(element.text());
//     //   console.log('brand name:', omg);
//     // });
//     // let li = $(products)
//     //   .children()
//     //   .children('')
//     //   .html();

//     $('.prod-title').each((i, element) => {
//       //    let product =  new Product( {
//       //        brandName: element.text(),
//       //    })
//       console.log(
//         $(this)
//           .next()
//           //   .children()
//           .text()
//       );
//     });
//     // console.log(products[0]);
//   })
//   .catch(console.error);
