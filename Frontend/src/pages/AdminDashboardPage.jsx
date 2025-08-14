import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PenTool, Users, BookOpen, TrendingUp, Search, Trash2, Eye, Calendar, Heart, MessageCircle, UserCheck, BarChart3, Activity } from 'lucide-react';

const AdminDashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, usersData, postsData, analyticsData] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts'),
        api.get('/admin/analytics')
      ]);
      
      setDashboardStats(stats.data);
      setUsers(usersData.data.users || usersData.data);
      setPosts(postsData.data.posts || postsData.data);
      setAnalytics(analyticsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their data?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/admin/posts/${postId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    stripHtml(post.text || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabConfig = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'posts', name: 'Posts', icon: BookOpen },
    { id: 'analytics', name: 'Analytics', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <PenTool className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">Blogify</h1>
              </div>
              <div className="hidden lg:block w-px h-6 bg-gray-300"></div>
              <h2 className="hidden lg:block text-xl font-semibold text-gray-700">Admin Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-2">
          <nav className="flex space-x-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats?.totalUsers || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                    <Users className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats?.totalPosts || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                    <BookOpen className="h-6 w-6 text-green-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Users (7 days)</p>
                    {/* ✅ FIX: Use dashboardStats instead of analytics */}
                    <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats?.newUsers7Days || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <UserCheck className="h-6 w-6 text-blue-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
              
              <div className="group bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Posts (7 days)</p>
                    {/* ✅ FIX: Use dashboardStats instead of analytics */}
                    <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats?.newPosts7Days || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                    <TrendingUp className="h-6 w-6 text-purple-600 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

{activeTab === 'users' && (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 max-w-6xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
    
    <div className="max-w-6xl mx-auto space-y-4">
      {filteredUsers.map((user) => (
        <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.profilePic ? (
                  <img
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                    src={user.profilePic}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-100">
                    <span className="text-white font-semibold text-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user.postsCount || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user.followersCount || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user.followingCount || 0}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Following</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete user"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === 'posts' && (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 max-w-4xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts by content or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
    
    <div className="max-w-4xl mx-auto space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-6">
              <div className="text-gray-900 font-medium leading-relaxed mb-3" 
                   dangerouslySetInnerHTML={{ 
                     __html: post.text.substring(0, 200) + (post.text.length > 200 ? '...' : '')
                   }}>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {(post.user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>By {post.user?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span>{post.likesCount || 0} likes</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentsCount || 0} comments</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeletePost(post._id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
              title="Delete post"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-gray-900">User Growth</h3>
                </div>
                <div className="space-y-4">
                  {analytics.userGrowth?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{item._id.month}/{item._id.year}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-indigo-600">{item.count}</span>
                        <span className="text-sm text-gray-500">users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Post Growth</h3>
                </div>
                <div className="space-y-4">
                  {analytics.postGrowth?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{item._id.month}/{item._id.year}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">{item.count}</span>
                        <span className="text-sm text-gray-500">posts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Top Users by Followers</h3>
                </div>
                <div className="space-y-4">
                  {analytics.topUsersByFollowers?.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900">@{user.username}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">{user.followersCount}</span>
                        <span className="text-sm text-gray-500">followers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Top Posts by Likes</h3>
                </div>
                <div className="space-y-4">
                  {analytics.topPostsByLikes?.map((post, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-purple-600">#{index + 1}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-purple-600">{post.likesCount}</span>
                          <span className="text-sm text-gray-500">likes</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">
                        {post.text.substring(0, 80)}
                        {post.text.length > 80 && <span className="text-gray-400">...</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
