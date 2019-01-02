// css
import './LoginPage.css';

// custom component
import Auth from '../Auth/Auth';

// 3 party library
import { Button, Form, FormGroup, Label, Input, FormFeedback, Alert } from 'reactstrap';
import { auth } from '../firebase';

// react
import React from 'react';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {
      valid: {
        email: '',
        password: '',
      },
      error: '',
      user: {
        email: '',
        password: ''
      }
    };

    // bind functions
    this.validateUser = this.validateUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(event) {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;

    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        // Handle Errors here.
        this.setState({
          error: error.message
        });
      });

    auth.onAuthStateChanged(user => {
      if (user) {
        Auth.authenticateUser();
        this.props.history.push('/');
      }
    });
  }

  validatePassword(password) {
    const valid = this.state.valid;
    var password = password.trim();
    if (password.length >= 8) {
      valid.password = 'valid';
    } else {
      valid.password = 'invalid';
    }

    this.setState({
      valid: valid
    });
  }

  validateEmail(email) {
    const email_pattern = RegExp('^[^!#$%&\'*+-/=?^_`{|}~]+(.[^!#$%&\'*+-/=?^_`{|}~])*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    const valid = this.state.valid;

    if (email_pattern.test(email)) {
      valid.email = 'valid';
    } else {
      valid.email = 'invalid'
    }

    this.setState({
      valid: valid
    });
  }

  validateUser(event) {
    const field_name = event.target.name;
    const field_val = event.target.value;

    switch (field_name) {
      case "email":
        this.validateEmail(field_val);
        break;
      case "password":
        this.validatePassword(field_val);
        break;
      default:
        return
    }
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user: user
    });
  }

  render() {
    return (
      <div className='container-fluid out-container'>
        <div className='form-container'>
          <h4>Log in</h4>
          <Form onSubmit={this.submitForm}>
            {this.state.error !== '' && <Alert color="danger">{this.state.error}</Alert>}
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input type="email" name="email" id="email" placeholder="myemail@email.com"
              onChange={e => {
                this.validateUser(e);
                this.changeUser(e);
              }}
              valid={this.state.valid.email === 'valid'}
              invalid={this.state.valid.email === 'invalid'}  />
              </FormGroup>
              <FormFeedback>Invalid email address.</FormFeedback>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input type="password" name="password" id="password" placeholder="********"
              onChange={e => {
                this.validateUser(e);
                this.changeUser(e);
              }}
              valid={this.state.valid.password === 'valid'}
              invalid={this.state.valid.password === 'invalid'} />
              <FormFeedback>Password must contain no less than 8 chars.</FormFeedback>
            </FormGroup>
            <div className="button-container">
              <Button color="primary">Log in</Button>
              <a href='/signup'>Sign up now</a>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
