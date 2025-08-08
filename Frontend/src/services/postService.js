import api from './api';

const createPost = (postData) => {
  return api.post('/posts', postData);
};

const getFeed = () => {
  return api.get('/posts/feed');
};

const getMyPosts = () => {
  return api.get('/posts/my-posts');
};

const likePost = (postId) => {
  return api.post(`/posts/like/${postId}`);
};

const commentOnPost = (postId, commentData) => {
  return api.post(`/posts/comment/${postId}`, commentData);
};

const updatePost = (postId, postData) => {
  return api.put(`/posts/${postId}`, postData);
};

const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};

export default { createPost, getFeed, getMyPosts, likePost, commentOnPost, updatePost, deletePost };
