import { BACKEND_URL } from './backendURL';
import { setToken } from './localStorage';

export interface LoginUser {
  userName: string;
  password: string;
}

export const loginUser = async (registerObj: LoginUser): Promise<string | null> => {
  try {
    const resp = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: registerObj.userName, password: registerObj.password }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    setToken(data.access_token);
    return data.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export interface RegisterUser {
  username: string;
  password: string;
}

export const registerUser = async (registerObj: RegisterUser): Promise<string | null> => {
  try {
    const resp = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerObj),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    setToken(data.access_token);
    return data.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
};
