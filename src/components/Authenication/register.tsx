// import * as React from 'react';
// import { useAuth } from '../../context/AuthContext';

// interface RegisterState {
//   password: string;
//   confirmPassword: string;
//   email: string;
//   username: string;
//   isLoading: boolean;
//   error: string;
// }

// type RegisterAction =
//   | { type: 'register' | 'success' | 'error' }
//   | { type: 'field'; fieldName: string; payload: string };

// const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
//   switch (action.type) {
//     case 'field': {
//       return {
//         ...state,
//         [action.fieldName]: action.payload,
//       };
//     }
//     case 'register': {
//       return {
//         ...state,
//         error: '',
//         isLoading: true,
//       };
//     }
//     case 'success': {
//       return { ...state, error: '', isLoading: false };
//     }
//     case 'error': {
//       return {
//         ...state,
//         isLoading: false,
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         error: 'Error username, email or password!',
//       };
//     }

//     default:
//       return state;
//   }
// };

// const initialState: RegisterState = {
//   password: '',
//   confirmPassword: '',
//   email: '',
//   username: '',
//   isLoading: false,
//   error: '',
// };

// export default function Register() {
//   const [state, dispatch] = React.useReducer(registerReducer, initialState);
//   const { username, email, password, confirmPassword, isLoading, error } = state;
//   const { emailPasswordSignup } = useAuth()

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
//     const passwordRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');

//     if (!emailRegex.test(email)) {
//       alert('invalid email');
//       return false;
//     } else if (!passwordRegex.test(password)) {
//       alert('password must contain 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character');
//       return false;
//     } else if (password != confirmPassword) {
//       alert('passwords don\'t match!');
//       return false;
//     } else if (username.length < 5) {
//       alert('invalid username');
//       return false;
//     }

//     dispatch({ type: 'register' });
//     emailPasswordSignup(email, password);
//   };

//   return (
//     <div>
//       <div>
//         {
//           <form onSubmit={onSubmit}>
//             {error && <p>{error}</p>}
//             <p> Register</p>
//             <input
//               type='text'
//               placeholder='Username'
//               value={username}
//               onChange={(e) =>
//                 dispatch({
//                   type: 'field',
//                   fieldName: 'username',
//                   payload: e.currentTarget.value,
//                 })
//               }
//             />
//             <input
//               type='text'
//               placeholder='Email'
//               value={email}
//               onChange={(e) =>
//                 dispatch({
//                   type: 'field',
//                   fieldName: 'email',
//                   payload: e.currentTarget.value,
//                 })
//               }
//             />
//             <input
//               type='password'
//               placeholder='Password'
//               autoComplete='new-password'
//               value={password}
//               onChange={(e) =>
//                 dispatch({
//                   type: 'field',
//                   fieldName: 'password',
//                   payload: e.currentTarget.value,
//                 })
//               }
//             />
//             <input
//               type='password'
//               placeholder='Confirm Password'
//               autoComplete='confirm-password'
//               value={confirmPassword}
//               onChange={(e) =>
//                 dispatch({
//                   type: 'field',
//                   fieldName: 'confirmPassword',
//                   payload: e.currentTarget.value,
//                 })
//               }
//             />
//             <button type='submit' disabled={isLoading}>
//               {isLoading ? 'Registering.....' : 'Register'}
//             </button>
//           </form>
//         }
//       </div>
//     </div>
//   );
// }
export {};
