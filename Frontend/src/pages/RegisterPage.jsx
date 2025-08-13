import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { PenTool, Eye, EyeOff, Mail, Lock, User,Heart, Github, UserCheck, ArrowRight, CheckCircle, AlertCircle, Loader, Star } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { name, username, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = { name, username, email, password };
      await register(userData);
      navigate('/');
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        'Registration failed. Please try again.';
      setError(message);
      console.error('Registration failed:', message);
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show a message instead of the form
  if (user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
          
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-6">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-900">Already registered</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back!</h3>
                <p className="text-xl text-gray-600">
                  You are already logged in as <span className="font-semibold text-blue-600">{user.name || user.username}</span>
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="space-y-4">
                  <Link
                    to="/home"
                    className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-lg"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10"></div>
        
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md">
            {/* Welcome Message */}
            <div className="text-center mb-12">
              
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Create Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Account
                </span>
              </h1>
              
              
            </div>

            {/* Registration Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative">
              {error && (
                <div className="flex items-center p-4 mb-6 text-red-800 bg-red-50 rounded-2xl border border-red-200" role="alert">
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
                        value={name}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Choose a unique username"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
                        value={username}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
                        value={email}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                        autocomplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 ml-1">Must be at least 6 characters long</p>
                  </div>

                  {/* Register Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin h-5 w-5 mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Sign In Instead
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Social Proof */}
            
          </div>
        </div>
      </div>
      
{/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
  <div className="max-w-6xl mx-auto px-4 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
      {/* Left side - Copyright */}
      <div className="text-gray-400 text-sm">
        © 2025 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 font-semibold">Blogify</span>. All rights reserved.
      </div>
      
      {/* Right side - Developer Credit */}
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <span>Built with</span>
        <Heart className="h-4 w-4 text-red-500 fill-current" />
        <span>by</span>
        <a 
          href="https://github.com/prathamesonar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1 transition-colors"
        >
          <span>Prathamesh Sonar</span>
          <Github className="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</footer>
    </>
  );
};

export default RegisterPage;
