import axios from 'axios';
// import cheerio from 'cheerio';

//Action Types
const SEARCH = 'SEARCH';

//Initial State
const initialState = {
  products: [],
};

//Action Creators
const searchProducts = products => ({
  type: SEARCH,
  products,
});

//THUNK
export const searchThunk = keyword => async dispatch => {
  try {
    //axios call for sephora
    const sephora = await axios.get(`/api/sephora/${keyword}`);
    let sephoraData = sephora.data;

    //axios call for sokoglam
    const sokoglam = await axios.get(`/api/shopify/sokoglam/${keyword}`);
    let sokoglamData = sokoglam.data;

    const glowieco = await axios.get(`/api/shopify/glowieco/${keyword}`);
    let glowiecoData = glowieco.data;

    const oo35mm = await axios.get(`/api/shopify/oo35mm/${keyword}`);
    let oo35mmData = oo35mm.data;

    const kollectionk = await axios.get(`/api/shopify/kollectionk/${keyword}`);
    let kollectionkData = kollectionk.data;

    const peachandlily = await axios.get(
      `/api/shopify/peachandlily/${keyword}`
    );
    let peachandlilyData = peachandlily.data;

    const yesstyle = await axios.get(`/api/yesstyle/${keyword}`);
    let yesstyleData = yesstyle.data;

    let allProducts = sokoglamData.concat(
      glowiecoData,
      oo35mmData,
      kollectionkData,
      peachandlilyData,
      sephoraData,
      yesstyleData
    );
    dispatch(searchProducts(allProducts));
  } catch (error) {
    console.error(error);
  }
};

export default function searchReducer(searchState = initialState, action) {
  switch (action.type) {
    case SEARCH:
      console.log(searchState);
      return {
        ...searchState,
        products: action.products,
      };
    default:
      return searchState;
  }
}
