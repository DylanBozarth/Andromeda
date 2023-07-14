import { createContext } from 'react';

export const AuthContext = createContext({
  user: {} as any,
  isLoading: false,
  setUser: () => {},
});
