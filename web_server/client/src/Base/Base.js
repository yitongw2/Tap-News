import './Base.css';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from '../App/App'
import Auth from '../Auth/Auth';
import NavBar from '../NavBar/NavBar';
import IntroPage from '../IntroPage/IntroPage';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';

const Base = () => (
  <Router>
    <div>
      <NavBar />
      <br />
      <Route exact path="/" render={() => (Auth.isUserAuthenticated() ? (<App />) : (<IntroPage />))} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignUpPage} />
    </div>
  </Router>
);

export default Base;
