import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenTool, Users, BookOpen, TrendingUp, Edit3, MessageCircle, Eye, Heart } from 'lucide-react';

const LandingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to home
  useEffect(() => {
    if (!loading && user) {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Blogify</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact
              </Link>
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">Welcome, {user.name || user.username}</span>
                  <Link
                    to="/home"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm"
                  >
                    Start Writing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Share Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Stories</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create, publish, and grow your audience with the most intuitive blogging platform designed for writers who want to focus on what matters most.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Writing Today
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-indigo-600"> Blog</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools and features designed to help you create compelling content and build your audience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            

            

            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <Users className="h-6 w-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Building</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with fellow writers, engage with readers through comments, and build a loyal following around your content.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your posts with tags, categories, and collections. Create series and manage drafts effortlessly.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                <MessageCircle className="h-6 w-6 text-indigo-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reader Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                Foster meaningful discussions with built-in commenting system, reactions, and newsletter subscription tools.
              </p>
            </div>

            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Voice?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
            Join thousands of writers who trust Blogify to share their stories with the world. Start your blogging journey today.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Your Blog Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <PenTool className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">Blogify</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The modern blogging platform for writers who want to focus on creating amazing content.
              </p>
            </div>
            
            
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                {user ? (
                  <li><Link to="/home" className="hover:text-white transition-colors">Dashboard</Link></li>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                    <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Blogify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;