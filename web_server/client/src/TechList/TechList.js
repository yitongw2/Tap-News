import './TechList.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPython, faJs } from '@fortawesome/free-brands-svg-icons'

import redux from '../Resource/redux.png';
import react from '../Resource/react.png';
import mongodb from '../Resource/mongodb.png';
import redis from '../Resource/redis.png';
import scrapy from '../Resource/scrapy.png';
import nginx from '../Resource/nginx.png';
import tensorflow from '../Resource/tensorflow.png';
import nodejs from '../Resource/nodejs.png';
import express from '../Resource/express.png';
import docker from '../Resource/docker.png';

import React from 'react';

class TechList extends React.Component {
  render() {
    return (
      <div className='container-fluid techlist_container card'>
        <div className='techlist_title'>
          What Is This App Made Of?
        </div>
        <div className='techlist_header'>
          <div className='lang'>
            <FontAwesomeIcon icon={faJs} size="lg" />
            <span>Javascript</span>
          </div>
          <div className='lang'>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </div>
          <div className='lang'>
            <FontAwesomeIcon icon={faPython} size="lg" />
            <span>Python</span>
          </div>
        </div>
        <hr />
        <div className='techlist'>
          <div className='tool'>
            <a href='https://reactjs.org/'>
              <img src={react} alt='reacr'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://redux.js.org/'>
              <img src={redux} alt='redux'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.mongodb.com/'>
              <img src={mongodb} alt='mongodb'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://redislabs.com'>
              <img src={redis} alt='redis'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://scrapy.org/'>
              <img src={scrapy} alt='scrapy'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.nginx.com/'>
              <img src={nginx} alt='nginx'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.tensorflow.org/'>
              <img src={tensorflow} alt='tensorflow'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.nodejs.org/'>
              <img src={nodejs} alt='nodejs'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.expressjs.com/'>
              <img src={express} alt='express'></img>
            </a>
          </div>
          <div className='tool'>
            <a href='https://www.docker.com/'>
              <img src={docker} alt='docker'></img>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default TechList;
