import './App.css';
import logo from '../Resource/logo.png';

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

import NewsPanel from '../NewsPanel/NewsPanel';

import React from 'react';

class App extends React.Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <div className='container'>
          <div className='logo_container'>
            <img className='logo' src={logo} alt='logo'></img>
          </div>
          <NewsPanel />
        </div>
      );
    } else {
      return (
        <Redirect to='/about' />
      );
    }
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.token != null
  }
};

export default connect(mapStateToProps)(App);
