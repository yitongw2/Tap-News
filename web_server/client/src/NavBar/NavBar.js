import './NavBar.css';

import React from 'react';
import Auth from '../Auth/Auth';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
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
                  Hi, {Auth.getEmail()}
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => this.logout()}>Log out</NavLink>
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
    /*
      return (
          <Navbar className="header" light expand="lg">
            <NavbarBrand className="brand-text" href="/">Tap News</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse className="collapse" isOpen={this.state.isOpen} navbar>
                {
                  Auth.isUserAuthenticated() ?
                  (
                    <Nav className="ml-auto" navbar>
                     <NavItem className="nav-item">{Auth.getEmail()}</NavItem>
                     <NavItem classNameName="nav-item"><NavLink onClick={() => this.logout()}>Log out</NavLink></NavItem>
                    </Nav>
                  ):
                  (
                    <Nav className="ml-auto" navbar>
                      <NavItem className="nav-item"><NavLink href="/login">Log in</NavLink></NavItem>
                      <NavItem className="nav-item"><NavLink href="/signup">Sign up</NavLink></NavItem>
                    </Nav>
                  )
                }
            </Collapse>
          </Navbar>
      );
      */
    }
}

/*
<div className="collapse navbar-collapse">
  <ul classNameName="navbar-nav">
  {Auth.isUserAuthenticated() ?
    (<div>
      <li classNameName="nav-item">{Auth.getEmail()}</li>
      <li classNameName="nav-item"><a onClick={() => this.logout()}>Log out</a></li>
     </div>)
     :
     (<div>
       <li classNameName="nav-item"><Link to="/login">Log in</Link></li>
       <li classNameName="nav-item"><Link to="/signup">Sign up</Link></li>
      </div>)
  }
 </ul>
</div>
*/

export default NavBar;
