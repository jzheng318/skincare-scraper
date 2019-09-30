import React from 'react';
import { connect } from 'react-redux';
import { searchThunk } from '../../store/search';
import Landing from './landing';
import AllProducts from '../products/allProducts';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      isLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setState = this.setState.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.id]: evt.target.value,
    });
  }
  async handleKey(evt) {
    // evt.preventDefault();
    if (evt.key === 'Enter') {
      await this.props.getAllProducts(this.state.search);
      await this.setState({ search: '' });
    }
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    await this.setState({ isLoading: true }, () => {
      console.log(this.state);
    });

    await this.props.getAllProducts(this.state.search);
    await this.setState({ isLoading: false });
  }

  render() {
    console.log('after render:', this.props.products);
    return (
      <div>
        <div className="grey lighten-2">
          <div className="nav-wrapper container row">
            <form onSubmit={this.handleSubmit}>
              <div className="input-field col s9 ">
                <input
                  className="grey lighten-2"
                  id="search"
                  type="search"
                  //   defaultValue={this.state.keyword}
                  onChange={this.handleChange}
                  required
                />
                <label className="label-icon" htmlFor="search">
                  <i className="material-icons">search</i>
                </label>
              </div>
              <button
                className="btn waves-effect waves-red btn-flat btn-large col s2 offset-s1"
                type="submit"
                name="action"
              >
                Search
                <i class="material-icons right">send</i>
              </button>
            </form>
          </div>
        </div>

        {!this.state.isLoading ? (
          !this.props.products.length ? (
            <Landing />
          ) : (
            <AllProducts products={this.props.products} />
          )
        ) : (
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
        )}
        {/* {this.state.isLoading ? } */}
      </div>
    );
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
)(SearchBar);
