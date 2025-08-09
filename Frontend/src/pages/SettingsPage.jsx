import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { User, Shield, Key, Trash2, LogOut, Eye, EyeOff, Check, X } from 'lucide-react';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
  
    setIsLoading(true);
    try {
      // ✅ Send only required fields to the backend
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
  
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password', error);
      alert(error.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your posts, comments, and account data. Are you absolutely sure?')) {
        setIsLoading(true);
        try {
          await authService.deleteAccount(); // ✅ delete account
          authService.logout(); // clear server session
          localStorage.removeItem('token'); // clear local token
          setUser(null); // clear user in context
          window.location.href = '/'; // ✅ redirect to landing page
        } catch (error) {
          console.error('Failed to delete account', error.response?.data || error.message);
          alert(error.response?.data?.message || 'Failed to delete account. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  

  const handleSignOut = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Information Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 col-span-full lg:col-span-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Account Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Name</span>
                <span className="text-gray-900 font-semibold">{user?.name || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-gray-900 font-semibold">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600 font-medium">Username</span>
                <span className="text-gray-900 font-semibold">@{user?.username}</span>
              </div>
            </div>
          </div>
          

          {/* Security Settings Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 col-span-full">
            
            <div className="p-6">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Key className="h-4 w-4" />
                <span>Change Password</span>
              </button>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="mt-6 bg-gray-50 rounded-xl p-6">
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-4">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="h-4 w-4" />
                        <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowChangePassword(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden hover:shadow-2xl transition-all duration-300 col-span-full">
            
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-800 font-medium mb-2">Delete Account</p>
                <p className="text-red-600 text-sm">
                  This action is permanent and cannot be undone. All your posts, comments, and account data will be permanently deleted.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isLoading ? 'Processing...' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;