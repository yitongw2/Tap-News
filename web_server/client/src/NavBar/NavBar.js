import './NavBar.css';

import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { connect } from 'react-redux'
import { logOut } from '../Redux/actions';

import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout() {
    this.toggle();
    this.props.deauthenticateUser();
  }

  render() {
    return (
      <Navbar className='nav-bar' light expand="md">
        <Link className='brand' to="/">Tap News</Link>
        <NavbarToggler type="button" onClick={this.toggle} />

        <Collapse isOpen={this.state.isOpen} navbar className="nav-collapse">
          {
            this.props.isLoggedIn ?
            (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <div className="user_name">{this.props.email}</div>
                </NavItem>
                <NavItem>
                  <Link to="/" className="link" onClick={this.logout}>Logout</Link>
                </NavItem>
              </Nav>
            ) :
            (
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link to="/login" onClick={this.toggle} className="link">Login</Link>
                </NavItem>
                <NavItem>
                  <Link to="/signup" onClick={this.toggle} className="link">Signup</Link>
                </NavItem>
              </Nav>
            )
          }
        </Collapse>
      </Navbar>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.token != null,
    email: state.email
  }
};

const mapDispatchToProps = dispatch => {
  return {
    deauthenticateUser: () => {
      logOut()(dispatch);
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
