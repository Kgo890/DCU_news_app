import api from './axios';


export const scrapePosts = (payload) => api.post('/reddit/scrape', payload);


export const getPosts = () => api.get('/reddit/posts');


export const getPostsBySubreddit = (subreddit) =>
  api.get('/reddit/posts_by_subreddit', { params: { subreddit } });


export const getPostsByDateRange = (from, to) =>
  api.get('/reddit/posts_by_date_range', { params: { from_date: from, to_date: to } });


export const getPostsByKeyword = (keyword) =>
  api.get('/reddit/posts_by_keyword', { params: { keyword } });


export const getTimeline = () => api.get('/reddit/timeline');


export const getVerifiedSubreddits = () => api.get('/reddit/verified_subreddits');


export const deletePostById = (id) =>
  api.delete('/reddit/delete_post_by_id', { params: { id } });


export const deleteAllPosts = () => api.delete('/reddit/delete_all_post');
