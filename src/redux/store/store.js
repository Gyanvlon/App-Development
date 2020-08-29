import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import ReduxThunk from 'redux-thunk'
import { rootReducer } from '../reducer'; 
const middlewares = [ReduxThunk]
if (process.env.NODE_ENV === 'development') middlewares.push(logger)
const store = createStore(
    rootReducer, 
    composeWithDevTools(applyMiddleware(...middlewares)
));
export default store;