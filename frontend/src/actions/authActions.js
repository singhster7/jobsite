import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("https://jobsgram.herokuapp.com/api/users/register", userData)
    .then((res) => {
      if (userData.role === "applicants") {
        history.push({
          pathname: "/detailsa",
          state: { detail: [res.data, userData] },
        });
      } else {
        history.push({
          pathname: "/detailsr",
          state: { detail: [res.data, userData] },
        });
      }
    }) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("https://jobsgram.herokuapp.com/api/users/login", userData)
    .then((res) => {
      // Set token to localStorage
      const { token, user } = res.data;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded, user));
    })
    .catch((err) => {
      if (err.response) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};
// Set logged in user
export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: { decoded, user },
  };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}, {}));
};
