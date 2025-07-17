import React, { useState } from 'react';
import axios from '../auth';

const NewPage = () => {
  const [character, setCharacter] = useState('');
  const [subreddits, setSubreddits] = useState('');
  const [tags, setTags] = useState('');

  const handleSavePage = async () => {
    try {
      await axios.post('/auth/save_page', {
        character,
        subreddits: subreddits.split(',').map(s => s.trim()),
        tags: tags.split(',').map(t => t.trim())
      });
      alert('Page saved');
    } catch (err) {
      alert('Error saving page');
    }
  };

  return (
    <div style={{
      backgroundImage: `url('/assets/8.png')`,
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '40px',
        borderRadius: '10px',
        color: 'white',
        width: '350px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2>Create New Character Page</h2>
        <input
          type="text"
          placeholder="Character Name"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          style={{ marginBottom: '15px', padding: '10px' }}
        />
        <input
          type="text"
          placeholder="Subreddits (comma separated)"
          value={subreddits}
          onChange={(e) => setSubreddits(e.target.value)}
          style={{ marginBottom: '15px', padding: '10px' }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ marginBottom: '20px', padding: '10px' }}
        />
        <button
          onClick={handleSavePage}
          style={{ padding: '10px', backgroundColor: '#444', color: 'white', borderRadius: '20px' }}
        >
          Save Page
        </button>
      </div>
    </div>
  );
};

export default NewPage;
