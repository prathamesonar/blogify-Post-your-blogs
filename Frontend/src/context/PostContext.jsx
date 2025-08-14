import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFeed, getMyPosts } from '../services/postService';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState(null);
  const [myPosts, setMyPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ CORRECTED DEPENDENCIES: Removed state variables from the array.
  // This ensures the function is stable and doesn't become stale.
  const fetchFeed = useCallback(async (force = false) => {
    if (feedPosts && !force) {
      return;
    }
    setLoading(true);
    try {
      const posts = await getFeed();
      setFeedPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch feed posts.');
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Dependency array is now empty

  // ✅ CORRECTED DEPENDENCIES: Removed state variables from the array.
  const fetchMyPosts = useCallback(async (force = false) => {
    if (myPosts && !force) {
      return;
    }
    setLoading(true);
    try {
      const posts = await getMyPosts();
      setMyPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch your posts.');
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Dependency array is now empty

  const clearPosts = () => {
    setFeedPosts(null);
    setMyPosts(null);
  };

  const value = {
    feedPosts,
    myPosts,
    loading,
    error,
    fetchFeed,
    fetchMyPosts,
    setFeedPosts,
    setMyPosts,
    clearPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
