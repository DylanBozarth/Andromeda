import { STRAPI_URL } from '.';
import { setToken } from '../redux/localStorage';

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
  console.log({ responseData });
  setToken(responseData.jwt);
  console.log(responseData);
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
