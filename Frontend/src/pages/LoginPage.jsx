import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Loader, Heart, Github } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect based on role, wait for role to exist
  useEffect(() => {
    if (!user || !user.role) return;

    if (user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const { loginIdentifier, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = { loginIdentifier, password };
      await login(userData);
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Sign in to your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Account
                </span>
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative">
              {error && (
                <div className="flex items-center p-4 mb-6 text-red-800 bg-red-50 rounded-2xl border border-red-200">
                  <AlertCircle className="h-5 w-5 mr-3" />
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email or Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="loginIdentifier"
                        placeholder="Enter your email or username"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
                        value={loginIdentifier}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
                        value={password}
                        autocomplete="current-password"
                        onChange={onChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="animate-spin h-5 w-5 mr-2" />
                          Signing In...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Sign In
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-2xl"
                >
                  Create your account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
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

export default LoginPage;
