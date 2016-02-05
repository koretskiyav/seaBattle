import { createStore, applyMiddleware, compose } from 'redux';

import ApiClient from 'ApiClient';
import reducers from './reducers';
import clientMiddleware from './middleware/clientMiddleware';

const client = new ApiClient();

const store = compose(
    applyMiddleware(clientMiddleware(client)),
)(createStore)(reducers);

export default store;
