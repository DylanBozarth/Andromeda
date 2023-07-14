import { STRAPI_URL } from '.';
import { setToken } from '../redux/localStorage';

export interface LoginUser {
  identifier: string;
  password: string;
}

export const loginUser = async (registerObj: LoginUser) => {
  const responseData = await fetch(`${STRAPI_URL}/api/auth/local`, {
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

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async (registerObj: RegisterUser) => {
  const responseData = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
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

export const getUserDetails = async (userToken: string) => {
  const responseData = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  })
    .then((resp) => resp.json())
    .catch((err) => console.error(err));
  setToken(userToken);
  return responseData;
};
