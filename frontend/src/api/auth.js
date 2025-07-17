import api from './axios';


export const register = (user) => api.post('/auth/register', user);


export const login = (user) => api.post('/auth/login', user);


export const refreshToken = (data) => api.post('/auth/refresh', data);


export const savePage = (page) => api.post('/auth/save-page', null, {
  params: { page },
});


export const getSavedPages = () => api.get('/auth/saved-pages');


export const resetPassword = (data) => api.post('/auth/reset-password', data);


export const logout = (data) => api.post('/auth/logout', data);
