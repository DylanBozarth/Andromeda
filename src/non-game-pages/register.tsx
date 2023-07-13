import { useContext, useState } from 'react';
import { RegisterUser, getUserDetails, registerUser } from '../clientLibrary/auth';
import { useAppDispatch } from '../redux/hooks';
import { fetchSectorData } from '../redux/sectorSlice';
import { AuthContext } from '../context/AuthContext';

export const Register = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleClick = async () => {
    const registerObj: RegisterUser = {
      username: email,
      email,
      password,
    };
    await registerUser(registerObj);
    await dispatch(fetchSectorData());
    setUser();
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <p>REGISTER</p>
      <label>
        Email
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className='auth-btn' onClick={handleClick}>
        Register
      </button>
    </>
  );
};
