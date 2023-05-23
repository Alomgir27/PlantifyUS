import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import campings from './campings';
import data from './data'

const middlewares = [thunk];
const store = createStore(
  combineReducers({
    campings: campings,
    data: data
  }),
  applyMiddleware(...middlewares)
);

export default store;