import './Base.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from '../App/App'
import NavBar from '../NavBar/NavBar';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import IntroPage from '../IntroPage/IntroPage';
import Footer from '../Footer/Footer';

import React from 'react';

const Base = () => (
    <Router>
      <div>
        <NavBar />
        <br />
        <Route exact path="/" component={App} />
        <Route exact path='/about' component={IntroPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/signup" component={SignUpPage} />
        <Footer />
      </div>
    </Router>
);

export default Base;
