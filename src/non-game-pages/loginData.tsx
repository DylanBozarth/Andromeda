import { useEffect, useState } from 'react';
import { getUserDetails } from '../clientLibrary/auth';
import { getToken } from '../redux/localStorage';

export const LoginData = () => {
  const [userData, setUserData] = useState({} as any);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken() || '';
      const values = await getUserDetails(token);
      console.log({ values });
      setUserData(values);
    };
    fetchUserData();
  }, []);
  return <div>(Refresh after register) Logged in user: {userData.username}</div>;
};
