import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './NavBar.css';

import { Link } from 'react-router-dom';

import React from 'react';
import Auth from '../Auth/Auth';

class NavBar extends React.Component {

  logout() {
    console.log("logout");
    Auth.deauthenticateUser();
    window.location.replace('/');
  }

  render() {
    return (
      <nav className="nav-bar indigo lighten-1">
        <div className="nav-wrapper">
          <a href="/" className="brand-logo">Tap News</a>
          <ul id="nav-mobile" className="right">
            {Auth.isUserAuthenticated() ?
              (<div>
                <li>{Auth.getEmail()}</li>
                <li><a onClick={() => this.logout()}>Log out</a></li>
                </div>)
                :
              (<div>
                <li><Link to="/login">Log in</Link></li>
                <li><Link to="/signup">Sign up</Link></li>
              </div>)
            }
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
