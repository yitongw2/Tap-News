class Auth {
  static authenticateUser(token, email, expiresAt) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('expiresAt', expiresAt);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('token') != null && localStorage.getItem('expiresAt') != null
      && Date.now() < localStorage.getItem('expiresAt');
  }

  static deauthenticateUser() {
    console.log("deauthenticate user");
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('expiresAt');
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getEmail() {
    return localStorage.getItem('email');
  }

  static getExpiration() {
    return localStorage.getItem('expiresAt');
  }
}

export default Auth;
