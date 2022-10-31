import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { useState, ReactNode, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { AuthContextType } from '../types/AuthContextType';
import authErrors from '../utils/authErrors';

export const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const emailPasswordSignup = (email: string, password: string): Promise<void> => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate('/', { replace: true });
      })
      .catch((error) => {
        Object.entries(authErrors).forEach(([key, value]) => {
          if (error.code === 'auth/' + key) setError(value);
        });
      });
  };

  const emailPasswordLogin = (email: string, password: string): Promise<void> => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate('/', { replace: true });
      })
      .catch((error) => {
        Object.entries(authErrors).forEach(([key, value]) => {
          if (error.code === 'auth/' + key) setError(value);
        });
      });
  };

  const passwordReset = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === 'auth/' + key) setError(value);
      });
    });
  };

  const updateUserName = (name: string | null): Promise<void> => {
    return updateProfile(currentUser as User, {
      displayName: name,
    });
  };
  const updateUserProfilePic = (url: string | null): Promise<void> => {
    return updateProfile(currentUser as User, {
      photoURL: url,
    });
  };

  const updateUserEmail = (email: string): Promise<void> => {
    return updateEmail(currentUser as User, email).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === 'auth/' + key) setError(value);
      });
    });
  };

  const updateUserPassword = (password: string): Promise<void> => {
    return updatePassword(currentUser as User, password).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === 'auth/' + key) setError(value);
      });
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    emailPasswordSignup,
    emailPasswordLogin,
    loading,
    setLoading,
    error,
    setError,
    passwordReset,
    updateUserEmail,
    updateUserPassword,
    updateUserName,
    updateUserProfilePic,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
