import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
  .then(res => history.push('/login'))
  .catch(err => 
    dispatch({
    type: GET_ERRORS,
    payload: err.response.data
    })
  )
}
// Login - Get user token
export const loginUser = userData => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      // Save to local Storage
      const {token} = res.data; 
      // Set token to ls
      localStorage.setItem('jwtToken', token);
      // Set token to auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
}

// Set login user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove the auth header for future request
  setAuthToken(false)
  // Set current user to {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}))
}