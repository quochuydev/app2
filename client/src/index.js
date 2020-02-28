import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import { createLogger } from 'redux-logger';
import './index.css';
// import App from './containers/App';
import Layout from './containers/Layout';
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';
import CustomersReducer from './views/Admin/Customer/reducers';
import OrdersReducer from './views/Admin/Order/reducers';
import AppReducer from './views/Admin/App/reducers';
import { Map } from 'immutable';

const combinedReducers = combineReducers({
  customers: CustomersReducer,
  orders: OrdersReducer,
  app: AppReducer,
});

const middleware = [thunk];
const logger = createLogger({
  stateTransformer: state => {
    const newState = {};
    Object.keys(state).forEach(key => {
      const stateItem = state[key];
      newState[key] = Map.isMap(stateItem) ? stateItem.toJS() : stateItem;
    });
    return newState;
  }
});
middleware.push(logger);
const store = createStore(combinedReducers, {}, applyMiddleware(thunk, logger));
ReactDOM.render(
  <Provider store={store}>
    <Layout />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
