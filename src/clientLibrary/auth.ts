import { BACKEND_URL } from './backendURL';
import { setToken } from '../redux/localStorage';

export interface LoginUser {
  userName: string;
  password: string;
}
export const loginUser = async (registerObj: LoginUser) => {
  const responseData = await fetch(`${BACKEND_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerObj),
  }).then((resp) => resp.json())
    .catch((err) => console.error(err));
  setToken(responseData.jwt);
  return responseData.jwt;
  // Handle the JWT for future iterations
};


export interface RegisterUser {
  username: string;
  password: string;
}

export const registerUser = async (registerObj: RegisterUser) => {
  const responseData = await fetch(`${BACKEND_URL}auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerObj),
  })
    .then((resp) => resp.json())
    .catch((err) => console.error(err));
  setToken(responseData.jwt);
  return responseData.jwt;
  // Handle the JWT for future iterations
};
/*
export const getUserDetails = async (userToken: string) => {
  const responseData = await fetch(`${BACKEND_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  })
    .then((resp) => resp.json())
    .catch((err) => console.error(err));
  setToken(userToken);
  return responseData;
}; */
