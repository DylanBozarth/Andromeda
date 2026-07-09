import { useContext } from 'react';
import { AuthContext } from './AuthProvider/context/AuthContext';
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
        <div>
          <p>Logged in user: {user?.username}</p>
          <button style={{ border: '2px solid green' }} onClick={handleLogout}>
            LogOut
          </button>
        </div>
      ) : (
        <p>You are not logged in</p>
      )}

    </div>
  );
};
