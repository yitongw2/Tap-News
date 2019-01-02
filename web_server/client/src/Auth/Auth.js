import { auth } from '../firebase';

class Auth {
  static authenticateUser() {
    auth.currentUser.getIdToken()
      .then(token => {
        localStorage.setItem('token', token);
      })
  }

  static isUserAuthenticated() {
    return auth.currentUser != null;
  }

  static deauthenticateUser() {
    auth.signOut()
      .catch(error => {
        console.log(error.message);
      });
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getEmail() {
    return auth.currentUser.email;
  }
}

export default Auth;
