import { STRAPI_URL } from '.';

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
  // Handle the JWT for future iterations
};
