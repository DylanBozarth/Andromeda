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
  const [password2, setPassword2] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleClick = async () => {
    if (password === password2) {
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
    } 
    else {
      alert('Your passwords do not match')
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
              <input type="text" value={email} name="" onChange={(e) => setEmail(e.target.value)} />
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
