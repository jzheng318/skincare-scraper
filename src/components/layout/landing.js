import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { searchThunk } from '../../store/search';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(keyword) {
    this.props.getAllProducts(keyword);
  }

  render() {
    if (!this.state) {
      return (
        <div className="container">
          <h3 className="center">
            Please search for a product in the search bar above
          </h3>
        </div>
      );
    } else {
      return <h1> there are products in state</h1>;
    }
  }
}

const mapStateToProps = state => ({
  products: state.searchState.products,
});

const mapDispatchToProps = dispatch => {
  return {
    getAllProducts: keyword => dispatch(searchThunk(keyword)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
