import { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { getToken } from '../../redux/localStorage';
import { BACKEND_URL } from '../../clientLibrary/backendURL';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLoggedInUser = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setUserData(null);
        return;
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching logged in user:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchLoggedInUser(token);
    }
  }, []);

  const handleUser = () => {
    const token = getToken();
    if (token) {
      fetchLoggedInUser(token);
    } else {
      setUserData(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user: userData, setUser: handleUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
