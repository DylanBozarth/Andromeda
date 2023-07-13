import { useState } from 'react';
import { RegisterUser, registerUser } from '../clientLibrary/auth';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    const registerObj: RegisterUser = {
      username: email,
      email,
      password,
    };
    await registerUser(registerObj);
  };

  return (
    <div style={{ background: 'white', color: 'black', position: 'absolute', bottom: 0 }}>
      <p>Register</p>
      <label>
        Email
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button onClick={handleClick}>Register</button>
    </div>
  );
};
