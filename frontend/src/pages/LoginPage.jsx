export default App;

// 2. pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('/auth/login', { email, password });
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('/assets/1.png')`,
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
        <h2>Welcome back</h2>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }}>
          <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', borderRadius: '20px', background: '#444', color: 'white' }}>
            Register
          </button>
          <button onClick={handleLogin} style={{ padding: '10px 20px', borderRadius: '20px', background: '#444', color: 'white' }}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
