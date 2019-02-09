import './IntroPage.css';

import { Link } from 'react-router-dom'
import { Jumbotron, Button } from 'reactstrap';

import Timeline from '../Timeline/Timeline';
import TechList from '../TechList/TechList';

import React from 'react';

class IntroPage extends React.Component {
  render() {
    return (
      <div className='intro_container container'>
        <Jumbotron className='jumbotron_container'>
          <h1 className="display-7">Welcome to Tap News</h1>
          <p className="lead">This is a website where you will find fresh news accommodated for your appetite.</p>
          <hr className="my-4"></hr>
          <p>In order for us to recommend news to you, you have to become one of us.</p>
          <Button color="primary"><Link id='join-us-link' to="/signup">Join us right now</Link></Button>
        </Jumbotron>
        <TechList />
        <Timeline />
      </div>
    );
  }
}

export default IntroPage;
