import './Base.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../Redux/store'

import App from '../App/App'
import NavBar from '../NavBar/NavBar';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';

import React from 'react';

const Base = () => (
  <Provider store={store}>
    <Router>
      <div>
        <NavBar />
        <br />
        <Route exact path="/" component={<App>} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </div>
    </Router>
  </Provider>
);

export default Base;
