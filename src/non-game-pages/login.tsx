import { useState, useContext } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { LoginUser, loginUser } from '../clientLibrary/auth';
import { fetchSectorData } from '../redux/sectorSlice';
import { AuthContext } from '../context/AuthContext';
import { LoginData } from './loginData';
import { Link } from 'react-router-dom';

export const Login = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const handleClick = async () => {
    const registerObj: LoginUser = {
      identifier: email,
      password,
    };
    await loginUser(registerObj);
    await dispatch(fetchSectorData());
    setUser();
    setEmail('');
    setPassword('');
  };
  return (
    <>
    <div className='non-game-page'>
      <p>LOGIN</p>
      <label>
        Email
        <input type='email' value={email} className=' text-black' onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type='password' value={password}  className=' text-black'  onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button style={{ border: '2px solid green' }} onClick={handleClick}>
        Login
      </button>
      <Link to='/' className='p-2'>Back to homepage</Link>
      <LoginData />
      </div>
    </>
  );
};
