import './TechList.css';

import redux from '../Resource/redux.png';
import react from '../Resource/react.png';
import mongodb from '../Resource/mongodb.png';
import redis from '../Resource/redis.png'

import React from 'react';

class TechList extends React.Component {
  render() {
    return (
      <div className='container-fluid techlist_container'>
        <div className='techlist-header'>
          What is this app made of?
        </div>
        <hr />
        <div className='techlist'>
          <div className='tool'>
            <a href='https://reactjs.org/'>
              <img src={react} alt='reacr'></img>
            </a>
            <p>React</p>
          </div>
          <div className='tool'>
            <a href='https://redux.js.org/'>
              <img src={redux} alt='redux'></img>
            </a>
            <p>Redux</p>
          </div>
          <div className='tool'>
            <a href='https://www.mongodb.com/'>
              <img src={mongodb} alt='mongodb'></img>
            </a>
            <p>MongoDB</p>
          </div>
          <div className='tool'>
            <a href='https://redislabs.com'>
              <img src={redis} alt='redis'></img>
            </a>
            <p>Redis</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TechList;
