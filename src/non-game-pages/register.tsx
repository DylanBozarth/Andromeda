import { useContext, useState } from 'react';
import { RegisterUser, getUserDetails, registerUser } from '../clientLibrary/auth';
import { useAppDispatch } from '../redux/hooks';
import { fetchSectorData } from '../redux/sectorSlice';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LoginData } from './loginData';

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
    <div className='non-game-page'>
      <p>REGISTER</p>
      <label>
        Email
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button style={{ border: '2px solid green' }} onClick={handleClick}>
        Register
      </button>
      <Link to='/' className='p-2'>Back to homepage</Link>
      <LoginData />
      </div>
    </>
  );
};
