import { useState, useContext } from 'react';
import { LoginUser, loginUser } from '../clientLibrary/auth';
import { AuthContext } from './AuthProvider/context/AuthContext';
import { LoginData } from './loginData';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    const credentials: LoginUser = { userName, password };
    const token = await loginUser(credentials);
    if (!token) {
      setError('Invalid username or password.');
      return;
    }
    setUser();
    setUserName('');
    setPassword('');
  };

  return (
    <div className='non-game-page flex'>
      <Link to='/' className='m-5'>Back to homepage</Link>
      <div className="login-box">
        <div className='text-center p-3'>
          <h2>Login</h2>
          <LoginData />
          If you don&apos;t have an account, <Link to='/register'>Register here.</Link>
        </div>
        <form>
          <div className="user-box">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
