import { LOG_IN, LOG_OUT } from './actions';

const initialState = {
  email: null,
  token: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        email: action.email,
        token: action.token
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
