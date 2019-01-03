import 'bootstrap/dist/css/bootstrap.min.css';
import 'materialize-css/dist/css/materialize.min.css';

import ReactDOM from 'react-dom';
import { BrowserRouter as Router  } from 'react-router-dom';

import Base from './Base/Base';

import registerServiceWorker from './registerServiceWorker';
import React from 'react';

ReactDOM.render(<Router><Base /></Router>, document.getElementById('root'));
registerServiceWorker();
