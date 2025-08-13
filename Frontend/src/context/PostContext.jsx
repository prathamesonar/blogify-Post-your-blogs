import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFeed, getMyPosts } from '../services/postService';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState(null);
  const [myPosts, setMyPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    if (feedPosts) return; // <-- Don't refetch if we already have the data
    try {
      setLoading(true);
      const posts = await getFeed();
      setFeedPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch feed posts.');
    } finally {
      setLoading(false);
    }
  }, [feedPosts]);

  const fetchMyPosts = useCallback(async () => {
    if (myPosts) return; // <-- Don't refetch if we already have the data
    try {
      setLoading(true);
      const posts = await getMyPosts();
      setMyPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch your posts.');
    } finally {
      setLoading(false);
    }
  }, [myPosts]);
  
  // Function to manually clear posts (e.g., on logout)
  const clearPosts = () => {
    setFeedPosts(null);
    setMyPosts(null);
  }

  const value = {
    feedPosts,
    myPosts,
    loading,
    error,
    fetchFeed,
    fetchMyPosts,
    setFeedPosts,
    setMyPosts,
    clearPosts
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
