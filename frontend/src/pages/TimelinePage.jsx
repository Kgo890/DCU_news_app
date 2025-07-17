import React, { useEffect, useState } from 'react';
import axios from '../auth';

const TimelinePage = () => {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get('/reddit/timeline');
        setTimeline(res.data);
      } catch (err) {
        alert('Failed to load timeline');
      }
    };
    fetchTimeline();
  }, []);

  return (
    <div style={{ background: '#121212', color: 'white', padding: '40px', minHeight: '100vh' }}>
      <h2>DCU News Timeline</h2>
      {timeline.length === 0 ? (
        <p>No timeline data</p>
      ) : (
        timeline.map((entry, index) => (
          <div key={index} style={{ background: '#2c2c2c', marginBottom: '15px', padding: '15px', borderRadius: '10px' }}>
            <h4>{entry.date}</h4>
            {entry.posts.map((post, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <strong>{post.title}</strong>
                <p>{post.body}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default TimelinePage;