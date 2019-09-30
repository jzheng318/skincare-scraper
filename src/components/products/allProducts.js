import React from 'react';
import SingleProduct from './singleProduct';
// import NavBar from '../layout/navbar';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { searchSephoraThunk } from '../../store/search';

const AllProducts = props => {
  const products = props.products;
  console.log(products);
  return (
    <div className="row">
      {/* <div className="col s4"> */}
      {products.map(product => (
        <SingleProduct
          key={`${product.brand}|${product.product}|${product.price}`}
          product={product}
        />
      ))}
      {/* </div> */}
    </div>
  );
};

export default AllProducts;
