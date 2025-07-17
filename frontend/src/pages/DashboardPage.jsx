import React, { useState } from 'react';
import axios from '../auth';

const DashboardPage = () => {
  const [subreddit, setSubreddit] = useState('');
  const [tags, setTags] = useState('');
  const [maxPosts, setMaxPosts] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [results, setResults] = useState([]);

  const handleScrape = async () => {
    try {
      const response = await axios.post('/reddit/scrape', {
        subreddit,
        tags,
        max_posts: maxPosts
      });
      alert('Scrape successful');
    } catch (err) {
      alert('Scrape failed');
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get('/reddit/posts_by_keyword', {
        params: { keyword }
      });
      setResults(response.data);
    } catch (err) {
      alert('Keyword filter failed');
    }
  };

  const handleSubredditFilter = async () => {
    try {
      const response = await axios.get('/reddit/posts_by_subreddit', {
        params: { subreddit }
      });
      setResults(response.data);
    } catch (err) {
      alert('Subreddit filter failed');
    }
  };

  const handleDateFilter = async () => {
    try {
      const response = await axios.get('/reddit/posts_by_date_range', {
        params: { time_range: dateRange }
      });
      setResults(response.data);
    } catch (err) {
      alert('Date range filter failed');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('/reddit/delete_all_post');
      alert('All posts deleted');
      setResults([]);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', backgroundColor: '#111', color: 'white', padding: '20px' }}>
        <h2>Dashboard</h2>
        <input type="text" placeholder="Subreddit" value={subreddit} onChange={(e) => setSubreddit(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
        <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
        <input type="number" placeholder="Max Posts" value={maxPosts} onChange={(e) => setMaxPosts(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
        <button onClick={handleScrape} style={{ marginBottom: '10px', width: '100%' }}>Scrape</button>
        <button onClick={handleDeleteAll} style={{ marginBottom: '10px', width: '100%' }}>Delete All</button>
        <hr style={{ margin: '20px 0' }} />
        <input type="text" placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
        <button onClick={handleFilter} style={{ marginBottom: '10px', width: '100%' }}>Search by Keyword</button>
        <button onClick={handleSubredditFilter} style={{ marginBottom: '10px', width: '100%' }}>Search by Subreddit</button>
        <input type="text" placeholder="Date Range (e.g. today, this_week)" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
        <button onClick={handleDateFilter} style={{ width: '100%' }}>Search by Date</button>
      </div>
      <div style={{ width: '70%', padding: '20px', overflowY: 'auto' }}>
        <h2>Reddit Posts</h2>
        {results.length === 0 ? <p>No results</p> : results.map((post, index) => (
          <div key={index} style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <p><strong>Subreddit:</strong> {post.subreddit}</p>
            <p><strong>Date:</strong> {post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
