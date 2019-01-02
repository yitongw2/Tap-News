import './NavBar.css';

import Auth from '../Auth/Auth';

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    this.logout = this.logout.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout() {
    Auth.deauthenticateUser();
    this.props.history.push('/');
  }

  render() {
    return (
    <div className="container-fluid">
      <Navbar className='nav-bar' light expand="md">
        <NavbarBrand className="brand-text" href="/">Tap News</NavbarBrand>
        <NavbarToggler type="button" onClick={this.toggle} />
        <Collapse className="nav-collapse" isOpen={this.state.isOpen} navbar>
          {
            Auth.isUserAuthenticated() ?
            (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <div className="link">Hi, {Auth.getEmail()}</div>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.logout}>Log out</NavLink>
                </NavItem>
              </Nav>
            ) :
            (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <a className="link" href="/login">Login</a>
                </NavItem>
                <NavItem>
                  <a className="link" href="/signup">Signup</a>
                </NavItem>
              </Nav>
            )
          }

        </Collapse>
      </Navbar>
    </div>
    );
  }
}

export default NavBar;
