import { useState } from 'react';
import { RegisterUser, getUserDetails, registerUser } from '../clientLibrary/auth';
import { useAppDispatch } from '../redux/hooks';
import { fetchSectorData } from '../redux/sectorSlice';

export const Register = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    const registerObj: RegisterUser = {
      username: email,
      email,
      password,
    };
    await registerUser(registerObj);
    await dispatch(fetchSectorData());
  };

  return (
    <>
      <p>Register</p>
      <label>
        Email
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleClick}>Register</button>
    </>
  );
};
