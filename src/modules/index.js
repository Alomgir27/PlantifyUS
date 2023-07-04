import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import campings from './campings';
import data from './data'
import { treesReducer as trees } from './trees';

const middlewares = [thunk];
const store = createStore(
  combineReducers({
    campings: campings,
    data: data,
    trees: trees
  }),
  applyMiddleware(...middlewares)
);

export default store;