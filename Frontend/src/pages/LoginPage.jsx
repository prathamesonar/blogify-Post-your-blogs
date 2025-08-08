import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect to home page
      navigate('/home');
    }
  }, [user, navigate]);

  const { loginIdentifier, password } = formData;

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
      const userData = { loginIdentifier, password };
      await login(userData);
      navigate('/home'); // Redirect to home page on success
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(message);
      console.error('Login failed:', message);
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show a message instead of the form
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md px-8 py-6 mt-4 text-center bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Already Logged In</h3>
          <p className="text-gray-600 mb-6">
            You are already logged in as <strong>{user.name || user.username}</strong>.
          </p>
          <div className="space-y-4">
            <Link
              to="/home"
              className="w-full flex items-center justify-center px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center px-6 py-3 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        
        {error && (
          <div className="p-3 my-2 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="loginIdentifier">Email or Username</label>
              <input
                type="text"
                placeholder="Email or Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                name="loginIdentifier"
                value={loginIdentifier}
                onChange={onChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <div className="flex">
              <button 
                className="w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
