import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../auth';

const CharacterPage = () => {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/reddit/posts_by_keyword`, {
          params: { keyword: name }
        });
        setPosts(res.data);
      } catch (err) {
        alert('Failed to load character posts');
      }
    };
    fetchPosts();
  }, [name]);

  return (
    <div style={{
      background: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      padding: '40px'
    }}>
      <h2>{name} News</h2>
      {posts.length === 0 ? <p>No posts available</p> : posts.map((post, index) => (
        <div key={index} style={{ backgroundColor: '#333', marginBottom: '15px', padding: '15px', borderRadius: '8px' }}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
          <p><strong>Subreddit:</strong> {post.subreddit}</p>
          <p><strong>Date:</strong> {post.date}</p>
        </div>
      ))}
    </div>
  );
};

export default CharacterPage;
