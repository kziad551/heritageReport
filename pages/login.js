import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login({role}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      if (username === "adminReport") {
        const response = await axios.post(
          'https://heritage.top-wp.com/api/auth/local',
          {
            identifier: username,
            password: password,
          }
        );
  
        localStorage.setItem('token', response.data.jwt);
        router.push('/');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during login');
    }
  };
  
  
 
  
  return (
    <div className="containerLogin">
    <h1 className="title">Login</h1>
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit">Login</button>
    </form>
  </div>
  );
}


