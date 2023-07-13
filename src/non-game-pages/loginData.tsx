import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { setToken } from '../redux/localStorage';

export const LoginData = () => {
  const { user, setUser } = useContext<any>(AuthContext);
  const handleLogout = () => {
    setToken('');
    setUser();
  };

  return (
    <div>
      {user && user.username ? (
        <p>Logged in user: {user?.username}</p>
      ) : (
        <p>Register or login if fresh load</p>
      )}
      <button className='auth-btn' onClick={handleLogout}>
        LogOut
      </button>
    </div>
  );
};
