import { useContext, useState } from 'react';
import { RegisterUser, getUserDetails, registerUser } from '../clientLibrary/auth';
import { useAppDispatch } from '../redux/hooks';
import { fetchSectorData } from '../redux/sectorSlice';
import { AuthContext } from './AuthProvider/context/AuthContext';
import { Link } from 'react-router-dom';
import { LoginData } from './loginData';

export const Register = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleClick = async () => {
    if (password !== password2) {
      alert('Your passwords do not match')
    }
    if (password.length < 6) {
      alert('Your password needs to be a least 6 characters')
    }
    // add more validation here as we go
    else {
      const registerObj: RegisterUser = {
        username: userName,
        password: password
      };
      await registerUser(registerObj);
      // await dispatch(fetchSectorData());
      setUser();
      setUserName('');
      setPassword('');
    }

  };

  return (
    <>
      <div className='non-game-page flex'>
        <Link to='/' className='m-5'>Back to homepage</Link>
        <div className="login-box">

          <div className='text-center'>
            <h2>Register</h2>
            <LoginData />
          </div>
          <form>
            <div className="user-box">
              <input type="text" value={userName} name="" onChange={(e) => setUserName(e.target.value)} />
              <label className=''>Username</label>
            </div>
            <div className="user-box">
              <input type="password" name="" value={password} onChange={(e) => setPassword(e.target.value)} />
              <label>Password</label>
            </div>
            <div className="user-box">
              <input type="password" name="" value={password2} onChange={(e) => setPassword2(e.target.value)} />
              <label>Confirm Password</label>
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
    </>
  );
};
