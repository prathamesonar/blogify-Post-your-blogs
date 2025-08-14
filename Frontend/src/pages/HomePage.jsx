import React, { useEffect, useState } from 'react';
import { likePost, commentOnPost, deletePost, updatePost } from '../services/postService';
import { searchUsers } from '../services/userService';
import Post from '../components/Post';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { usePosts } from '../context/PostContext'; // Use the new PostContext

const HomePage = () => {
  const { feedPosts, loading: postsLoading, fetchFeed, setFeedPosts } = usePosts(); // Use state from PostContext
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // This will only fetch data if it hasn't been fetched before
    fetchFeed(true);

    // Fetch user suggestions (this can still be fetched on component mount)
    const fetchSuggestions = async () => {
      if (user) {
        try {
          const allUsers = await searchUsers('');
          if (Array.isArray(allUsers)) {
            const usersToSuggest = allUsers
              .filter(u => u._id !== user._id)
              .slice(0, 5);
            setSuggestedUsers(usersToSuggest);
          }
        } catch (error) {
          console.error("Failed to fetch suggested users", error);
        }
      }
    };
    fetchSuggestions();
  }, [user, fetchFeed]);

  const handlePostUpdate = (updatedPost) => {
    setFeedPosts(prevPosts => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  const handlePostDelete = (postId) => {
    setFeedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handleLike = async (postId) => {
    const originalPosts = [...feedPosts];
    const post = feedPosts.find((p) => p._id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(user._id);
    const updatedPost = {
      ...post,
      likes: isLiked
        ? post.likes.filter((id) => id !== user._id)
        : [...post.likes, user._id],
    };
    handlePostUpdate(updatedPost);

    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      setFeedPosts(originalPosts);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const updatedPostFromServer = await commentOnPost(postId, { text });
      handlePostUpdate(updatedPostFromServer);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEdit = (updatedPost) => {
    handlePostUpdate(updatedPost);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const results = await searchUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <main className="lg:col-span-2">
          {user ? (
            <>
              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name or username..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-14 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 text-lg font-medium shadow-sm hover:shadow-md"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    {searchResults.map((u) => (
                      <Link key={u._id} to={`/profile/${u.username}`} className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <img src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=ffffff&size=48`} alt={u.name} className="w-12 h-12 rounded-full object-cover"/>
                          <div>
                            <h4 className="font-semibold text-gray-900">{u.name}</h4>
                            <p className="text-sm text-indigo-600">@{u.username}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Feed */}
              {feedPosts && feedPosts.length > 0 ? (
                <div className="space-y-6">
                  {feedPosts.map(post => (
                    <Post 
                      key={post._id} 
                      post={post} 
                      onLike={handleLike}
                      onComment={handleComment}
                      onDelete={() => deletePost(post._id).then(() => handlePostDelete(post._id))}
                      onEdit={(updatedData) => updatePost(post._id, updatedData).then(handleEdit)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12 bg-white rounded-2xl shadow-sm">
                  <p className="text-xl mb-4">Your feed is empty.</p>
                  <p>Follow some users to see their posts here!</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center bg-white p-10 rounded-lg shadow">
              <h1 className="text-3xl font-bold mb-4">Welcome to Blogify!</h1>
              <p className="text-gray-600">Please login or register to see the feed.</p>
            </div>
          )}
        </main>
        {/* Sidebar */}
        <aside className="hidden lg:block space-y-6 sticky top-24 h-screen">
          {user && (
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 p-1">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-full h-full rounded-full object-cover bg-white"/>
                    ) : (
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                  <p className="text-indigo-600 font-medium text-sm">@{user.username}</p>
                </div>
              </div>
              <Link to={`/my-posts`} className="mt-6 block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                View My Profile
              </Link>
            </div>
          )}
          {suggestedUsers.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-indigo-500" />
                Who to Follow
              </h3>
              <div className="space-y-5">
                {suggestedUsers.map(sUser => (
                  <div key={sUser._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-300 to-purple-500 p-0.5">
                          {sUser.profilePic ? (
                            <img src={sUser.profilePic} alt={sUser.name} className="w-full h-full rounded-full object-cover bg-white"/>
                          ) : (
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600">
                                {sUser.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{sUser.name}</h4>
                        <p className="text-gray-500 text-xs">@{sUser.username}</p>
                      </div>
                    </div>
                    <Link to={`/profile/${sUser.username}`} className="text-xs bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium hover:bg-indigo-200 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
