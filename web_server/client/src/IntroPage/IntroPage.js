import './IntroPage.css';

import { Link } from 'react-router-dom'
import { Jumbotron, Button } from 'reactstrap';

import React from 'react';

class IntroPage extends React.Component {
  render() {
    return (
      <div className='container'>
        <Jumbotron>
          <h1 className="display-4">Welcome to Tap News</h1>
          <p className="lead">This is a website where you will find fresh news accommodated for your appetite.</p>
          <hr className="my-4"></hr>
          <p>In order for us to recommend news to you, you have to become one of us.</p>
          <Button color="primary"><Link id='join-us-link' to="/signup">Join us right now</Link></Button>
        </Jumbotron>
      </div>
    );
  }
}

export default IntroPage;
