import React from 'react';
import SignUpForm from './SignUpForm';
import { auth } from '../firebase';

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        confirm_password: ''
      }
    };
  }

  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;
    const confirm_password = this.state.user.confirm_password;

    if (password !== confirm_password) {
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.props.history.push('/login');
      })
      .catch(error => {
        let errors = {summary: error.message};
        this.setState({
          errors: errors
      });
    });
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({user});

    const errors = this.state.errors;
    if (this.state.user.password !== this.state.user.confirm_password) {
      errors.password = "Password and Confirm Password don't match.";
    } else {
      errors.password = '';
    }

    this.setState({errors});
  }

  render() {
    return (
      <SignUpForm
        onSubmit={(e) => this.processForm(e)}
        onChange={(e) => this.changeUser(e)}
        errors={this.state.errors}
      />
    );
  }
}

export default SignUpPage;
