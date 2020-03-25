import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import thunk from 'thunk'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import authReducer from './store/reducers/authReducer'


const rootReducer = combineReducers({
    auth: authReducer
})

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(rootReducer, composeEnhancers())

ReactDOM.render(<Provider store = {store}><App /></Provider>,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
