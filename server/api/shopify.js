const router = require('express').Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../firestore/index');

router.get('/:store', async (req, res, next) => {
  try {
    const store = req.params.store;
    let brandArray = [];
    const result = await axios
      .get(`https://${store}.com/products.json?limit=300`)
      .then(res => {
        const products = res.data.products;
        console.log(products.length);
        const shopifyBrands = products.map(item => {
          let name = item.vendor.trim();
          if (name[name.length - 1] === '.') {
            name = name.slice(0, name.length - 1);
          }
          return name;
        });
        return shopifyBrands;
      });

    let brandList = new Set(result);
    brandList.forEach(brand => {
      brandArray.push(brand);
    });
    // console.log(brandArray.length);
    res.send(brandArray);
  } catch (error) {
    next(error);
  }
});

router.get('/:store/:product', async (req, res, next) => {
  try {
    const store = req.params.store;
    const product = req.params.product;
    // console.log(product);
    let searchProds = {};
    let searchResults = [];
    const result = await axios
      .get(`https://${store}.com/products.json?limit=250`)
      .then(res => {
        const products = res.data.products;
        // console.log(products)
        const search = products.filter(
          item => item.handle.includes(product) || item.tags.includes(product)
        );
        // console.log(search);
        search.forEach(item => {
          let url = `http://${store}.com/products/${item.handle}`;
          searchProds[item.title] = {
            brand: item.vendor,
            product: item.title,
            price: item.variants[0].price,
            image: item.images[0].src,
            url: url,
            body: item.body_html,
            tags: item.tags,
            size: item.variants[0].grams,
            store: store,
            exclusive: false,
          };
          searchResults.push(searchProds[item.title]);
        });
        // console.log(searchResults);
        return searchResults;
      });
    // console.log(result);
    res.send(searchResults);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
