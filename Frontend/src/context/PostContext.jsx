import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFeed, getMyPosts } from '../services/postService';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState(null);
  const [myPosts, setMyPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // MODIFICATION: Add a 'force' parameter to control refetching
  const fetchFeed = useCallback(async (force = false) => {
    if (feedPosts && !force) return; // Don't refetch if data exists unless forced
    try {
      setLoading(true);
      const posts = await getFeed();
      setFeedPosts(Array.isArray(posts) ? posts : []);
    } catch (err)
{
      setError('Failed to fetch feed posts.');
    } finally {
      setLoading(false);
    }
  }, [feedPosts]);

  // MODIFICATION: Add a 'force' parameter here as well
  const fetchMyPosts = useCallback(async (force = false) => {
    if (myPosts && !force) return; // Don't refetch if data exists unless forced
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
    setFeedPosts, // Keep these setters if needed elsewhere
    setMyPosts,
    clearPosts
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
