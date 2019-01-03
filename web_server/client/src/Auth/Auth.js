import { auth } from '../firebase';

async function authenticateUser() {
  const user = auth.currentUser;
  localStorage.setItem('email', user.email)
  localStorage.setItem('token', await user.getIdToken());
}

function isUserAuthenticated() {
  return localStorage.getItem('token') != null;
}

function deauthenticateUser() {
  auth.signOut()
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    })
    .catch(error => {
      console.log('error: '+error.message);
    });
}

function getToken() {
  return localStorage.getItem('token');
}

function getEmail() {
  return localStorage.getItem('email');
}

const Auth = {
  'authenticateUser': authenticateUser,
  'deauthenticateUser': deauthenticateUser,
  'isUserAuthenticated':  isUserAuthenticated,
  'getToken': getToken,
  'getEmail': getEmail
};

export default Auth;
