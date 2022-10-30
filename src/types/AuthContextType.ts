import { User } from 'firebase/auth';

export type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: string;
  setError: (value: string) => void;
  setLoading: (value: boolean) => void;
  emailPasswordSignup: (email: string, password: string) => Promise<void>;
  emailPasswordLogin: (email: string, password: string) => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  updateUserName: (name: string | null) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
};
