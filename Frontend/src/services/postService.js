import api from './api';

export const createPost = (postData) => {
  return api.post('/posts', postData).then(response => response.data);
};

export const getFeed = () => {
  return api.get('/posts/feed').then(response => response.data);
};

export const getMyPosts = () => {
  return api.get('/posts/my-posts').then(response => response.data);
};

export const likePost = (postId) => {
  return api.post(`/posts/like/${postId}`).then(response => response.data);
};

export const commentOnPost = (postId, commentData) => {
  return api.post(`/posts/comment/${postId}`, commentData).then(response => response.data);
};

export const updatePost = (postId, postData) => {
  return api.put(`/posts/${postId}`, postData).then(response => response.data);
};

export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`).then(response => response.data);
};
