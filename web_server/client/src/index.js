import 'bootstrap/dist/css/bootstrap.min.css';
import 'materialize-css/dist/css/materialize.min.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react';

import Base from './Base/Base';

import registerServiceWorker from './registerServiceWorker';
import React from 'react';

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Base />
    </PersistGate>
  </Provider>
), document.getElementById('root'));
registerServiceWorker();
