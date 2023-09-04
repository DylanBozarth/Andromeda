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

    <div className='non-game-page flex'>
      <div className="login-box">
        <div className='text-center'>
        <h2>Login </h2>
        <LoginData />
        </div>
        <form>
          <div className="user-box">
            <input type="text" name="" />
            <label className=''>Username</label>
          </div>
          <div className="user-box">
            <input type="password" name="" />
            <label>Password</label>
          </div>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </a>
          
        </form>
      </div>
    </div>
  );
};
