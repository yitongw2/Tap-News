import './AboutMe.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

import React from 'react';

const avatar_url = 'https://avatars0.githubusercontent.com/u/13974845?s=400&u=4025fb47e9379f7203f68949004eef42818c3630&v=4';

class AboutMe extends React.Component {
  render() {
    return (
      <div className='container-fluid aboutme_container card'>
        <div className='avatar'>
          <img src={avatar_url} alt='avatar' />
        </div>
        <h2>Yitong Wu</h2>
        <div className='intro'>
        Student of computer science and gaming.
        An unranked LOL player.
        Into Python, Javascript, Unity, and a lot.
        FB SDE Intern for Summer 2019.
        </div>
        <div className='contact'>
          <a href='https://github.com/yitongw2'>
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
          <a href='https://www.linkedin.com/in/yitong-wu'>
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>
    );
  }
}

export default AboutMe;
