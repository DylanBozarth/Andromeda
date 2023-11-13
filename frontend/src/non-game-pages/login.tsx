import { useState, useContext } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { LoginUser, loginUser } from '../clientLibrary/auth';
import { fetchSectorData } from '../redux/sectorSlice';
import { AuthContext } from './AuthProvider/context/AuthContext';
import { LoginData } from './loginData';
import { Link } from 'react-router-dom';

export const Login = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const handleClick = async () => {
    const registerObj: LoginUser = {
      userName: userName,
      password: password
    };
    await loginUser(registerObj);
    // await dispatch(fetchSectorData());
    setUser();
    setUserName('');
    setPassword('');
  };
  return (

    <div className='non-game-page flex'>
      <Link to='/' className='m-5'>Back to homepage</Link>
      <div className="login-box">

        <div className='text-center p-3'>
          <h2>Login </h2>
          <LoginData />
          If you don&apos;t have an account, <Link to='/register' className=''>Register here.</Link> 
        </div>
        <form>
          <div className="user-box">
            <input type="text" value={userName} name="" onChange={(e) => setUserName(e.target.value)} required />
            <label className=''>Username</label>
          </div>
          <div className="user-box">
            <input type="password" name="" value={password} onChange={(e) => setPassword(e.target.value)} required={true} />
            <label>Password</label>
          </div>
          <a href="#" onClick={handleClick} className='glow'>
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
