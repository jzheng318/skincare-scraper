import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import searchReducer from './search';

const reducer = combineReducers({
  searchState: searchReducer,
});
const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default store;
// export * from './search';
