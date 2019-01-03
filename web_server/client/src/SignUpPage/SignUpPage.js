import './SignUpPage.css';

import loader from '../Resource/loader.gif';

import { Button, Form, FormGroup, Label, Input, FormFeedback, Alert } from 'reactstrap';
import { auth } from '../firebase';

import React from 'react';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      loading: false,
      valid: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      error: '',
      user: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    };

    this.validateUser = this.validateUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;

    this.setState({
      loading: true
    });

    auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.props.history.push('/login');
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
      });
    });
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
  }

  validatePassword(password) {
    const valid = this.state.valid;
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
    const email_pattern = RegExp('^[^!#$%&\'*+-/=?^_`{|}~]+(.[^!#$%&\'*+-/=?^_`{|}~])*@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z0-9]+.)+[a-zA-Z]{2,}))$');
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

  validateConfirmPassword(password) {
    const valid = this.state.valid;

    if (password !== this.state.user.password) {
      valid.confirmPassword = 'invalid';
    } else {
      valid.confirmPassword = 'valid';
    }

    this.setState({
      valid: valid
    });
  }

  validateUser(event) {
    const field_name = event.target.name;
    const field_val = event.target.value.trim();

    switch (field_name) {
      case "email":
        this.validateEmail(field_val);
        break;
      case "password":
        this.validatePassword(field_val);
        break;
      case "confirmPassword":
        this.validateConfirmPassword(field_val);
        break;
      default:
        return
    }
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='form-container'>
          <h4>Sign up</h4>
          {
            this.state.loading &&
            <div id='loading'>
              <img src={loader} alt='loadings'></img>
            </div>
          }
          <Form onSubmit={this.submitForm}>
            {this.state.error !== '' && <Alert color="danger">{this.state.error}</Alert>}
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="myemail@email.com"
              onChange={e => {
                this.validateUser(e);
                this.changeUser(e);
              }}
              valid={this.state.valid.email === 'valid'}
              invalid={this.state.valid.email === 'invalid'}  />
              <FormFeedback>Invalid email address.</FormFeedback>
              </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="********"
              onChange={e => {
                this.validateUser(e);
                this.changeUser(e);
              }}
              valid={this.state.valid.password === 'valid'}
              invalid={this.state.valid.password === 'invalid'} />
              <FormFeedback>Password must contain no less than 8 chars.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm password</Label>
              <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="********"
              onChange={e => {
                this.validateUser(e);
                this.changeUser(e);
              }}
              valid={this.state.valid.confirmPassword === 'valid'}
              invalid={this.state.valid.confirmPassword === 'invalid'} />
              <FormFeedback>Password does not match.</FormFeedback>
            </FormGroup>
            <div className="button-container">
              <Button color="primary">Sign up</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUpPage;
