import React from 'react';

const SingleProduct = props => {
  const product = props.product;
  console.log(product);
  console.log(product.numRatings);
  return (
    <div className="container">
      <div class="card horizontal">
        <div class="card-image">
          <img src={product.image} alt={product.product} />
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <span class="card-title activator red-text text-lighten-2">
              {product.brand}
              <i class="material-icons right">more_vert</i>
            </span>
            <div class="card-reveal">
              <span class="card-title ">
                {product.brand}
                <i class="material-icons right">close</i>
              </span>

              <span></span>
              <p>{product.body}</p>
            </div>
            <span>
              <p>{product.product}</p>
            </span>
            <p className="row light-green-text text-darken-2">
              <i class="material-icons left">attach_money</i>
              {product.price}
            </p>
            {product.rating ? (
              <div>
                <p className="row amber-text text-accent-3 left-align">
                  <i class="material-icons left">star_half</i>
                  {Math.round(product.rating * 10) / 10} stars
                </p>
                <p className="row teal-text text-darken-3 left-align">
                  <i class="material-icons left">person</i>
                  {product.numRatings} ratings
                </p>
              </div>
            ) : (
              <p className="row grey-text text-lighten-2">
                <i class="material-icons left">cancel</i>
                Rating not available
              </p>
            )}

            {product.size ? (
              <p className="row deep-purple-text text-lighten-2">
                Size: {product.size} grams
              </p>
            ) : (
              <p className="row grey-text text-lighten-2">
                <i class="material-icons left">cancel</i>
                Size not available
              </p>
            )}
            {product.exclusive ? (
              <p className="row indigo-text text-accent-2">
                <i class="material-icons left">new_releases</i>A Sephora
                Exclusive!
              </p>
            ) : (
              <p></p>
            )}
          </div>

          <div class="card-action">
            <a href={product.url}>{product.store}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
