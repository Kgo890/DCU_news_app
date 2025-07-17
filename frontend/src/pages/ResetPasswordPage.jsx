import React, { useState } from 'react';
import axios from '../auth';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    try {
      await axios.post('/auth/reset-password', {
        email,
        current_password: currentPassword,
        new_password: newPassword
      });
      alert('Password reset successful');
    } catch (error) {
      alert('Password reset failed');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('/assets/9.png')`,
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
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Current_password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="New_password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px', width: '100%' }}
        />
        <button onClick={handleReset} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '20px', background: '#444', color: 'white' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
