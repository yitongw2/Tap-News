import './IntroPage.css';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom'

import React from 'react';

class IntroPage extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className="jumbotron">
          <h1 className="display-4">Welcome to Tap News</h1>
          <p className="lead">This is a website where you will find fresh news accommodated for your appetite.</p>
          <hr className="my-4"></hr>
          <p>In order for us to recommend news to you, you have to be one of us.</p>
          <Link className='btn btn-primary btn-lg' to="/login">Join us right now</Link>
        </div>
      </div>
    );
  }
}

export default IntroPage;
