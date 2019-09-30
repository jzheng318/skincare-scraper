const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../firestore/index');

// router.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

router.get('/', async (req, res, next) => {
  try {
    let data = [];
    const result = await axios.get('https://www.sephora.com/brands-list');
    const $ = await cheerio.load(result.data);
    const returnEl = $('.css-kxa5od').each((i, element) => {
      let name = $(element).text();
      data.push(name);
    });
    res.send(data);
  } catch (error) {
    next(error);
  }
});

//keywords must be split by %20
router.get('/:keyword', async (req, res, next) => {
  try {
    const keyword = req.params.keyword;
    console.log(keyword);
    let sephoraProducts = {};
    let productArray = [];
    const products = await axios
      .get(
        `https://www.sephora.com/api/catalog/search?type=keyword&q=${keyword}&content=true&includeRegionsMap=true&page=60&currentPage=1`
      )
      .then(res => {
        const products = res.data.products;
        //sephora's brand pages will sometimes redirect to the actual product page, not search results.
        //in this, case, we will redirect the user to the product page
        if (products) {
          return products.map(product => {
            let image = `http://sephora.com${product.image450}`;
            let url = `http://www.sephora.com${product.targetUrl}`;
            sephoraProducts[product.productName] = {
              brand: product.brandName,
              product: product.productName,
              image: image,
              price: product.currentSku.listPrice.slice(1),
              rating: product.rating,
              url: url,
              store: 'Sephora',
              exclusive: product.currentSku.isSephoraExclusive,

              // this.otherInfo = obj.currentSku;
            };
            productArray.push(sephoraProducts[product.productName]);
          });
        }
        console.log(products);
        return products;
      });

    if (products) {
      res.send(productArray);
    } else {
      res
        // .status(404)
        .send([]);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
