import * as React from 'react';

interface RegisterState {
  password: string;
  email: string;
  username: string;
  isLoading: boolean;
  error: string;
}

type RegisterAction =
  | { type: 'register' | 'success' | 'error' }
  | { type: 'field'; fieldName: string; payload: string };

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    }
    case 'register': {
      return {
        ...state,
        error: '',
        isLoading: true,
      };
    }
    case 'success': {
      return { ...state, error: '', isLoading: false };
    }
    case 'error': {
      return {
        ...state,
        isLoading: false,
        username: '',
        email: '',
        password: '',
        error: 'Error username, email or password!',
      };
    }

    default:
      return state;
  }
};

const initialState: RegisterState = {
  password: '',
  email: '',
  username: '',
  isLoading: false,
  error: '',
};

export default function Login() {
  const [state, dispatch] = React.useReducer(registerReducer, initialState);
  const { username, email, password, isLoading, error } = state;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'register' });
  };

  return (
    <div>
      <div>
        {
          <form onSubmit={onSubmit}>
            {error && <p>{error}</p>}
            <p> Register</p>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) =>
                dispatch({
                  type: 'field',
                  fieldName: 'username',
                  payload: e.currentTarget.value,
                })
              }
            />
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) =>
                dispatch({
                  type: 'field',
                  fieldName: 'email',
                  payload: e.currentTarget.value,
                })
              }
            />
            <input
              type='password'
              placeholder='Password'
              autoComplete='new-password'
              value={password}
              onChange={(e) =>
                dispatch({
                  type: 'field',
                  fieldName: 'password',
                  payload: e.currentTarget.value,
                })
              }
            />
            <button type='submit' disabled={isLoading}>
              {isLoading ? 'Registering.....' : 'Register'}
            </button>
          </form>
        }
      </div>
    </div>
  );
}
