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
    // If we have posts and we are not forcing a refresh, exit early.
    if (feedPosts && !force) {
      return;
    }

    setLoading(true); // Set loading to true ONLY when we are about to fetch.
    try {
      const posts = await getFeed();
      setFeedPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch feed posts.');
    } finally {
      setLoading(false); // This will now always run, fixing the stuck loader.
    }
  }, [feedPosts]);

  const fetchMyPosts = useCallback(async (force = false) => {
    // If we have posts and we are not forcing a refresh, exit early.
    if (myPosts && !force) {
      return;
    }

    setLoading(true); // Set loading to true ONLY when we are about to fetch.
    try {
      const posts = await getMyPosts();
      setMyPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      setError('Failed to fetch your posts.');
    } finally {
      setLoading(false); // This will now always run, fixing the stuck loader.
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
