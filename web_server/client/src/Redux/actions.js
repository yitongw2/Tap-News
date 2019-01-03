import { auth } from '../firebase';

// action types
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const ERROR = 'ERROR';

// action creators
export const logIn = () => dispatch => {
  const user = auth.currentUser;
  return user.getIdToken()
    .then(token => {
      dispatch({
        type: LOG_IN,
        email: user.email,
        token: token
      });
    })
    .catch(err => {
      dispatch({
        type: ERROR,
        error: err.message
      });
    });
};

export const logOut = () => dispatch => {
  dispatch({
    type: LOG_OUT
  });
};
