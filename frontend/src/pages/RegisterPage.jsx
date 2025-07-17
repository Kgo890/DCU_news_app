// 3. pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../auth';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('/auth/register', { username, email, password });
      navigate('/');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('/assets/2.png')`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '40px',
          borderRadius: '10px',
          color: 'white',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2>Register for DCU News</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <button onClick={handleRegister} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '20px', background: '#444', color: 'white' }}>
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
