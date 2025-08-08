import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      await authService.changePassword(passwordData);
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your posts, comments, and account data. Are you absolutely sure?')) {
        try {
          await authService.deleteAccount();
          authService.logout();
          setUser(null);
          window.location.href = '/';
        } catch (error) {
          console.error('Failed to delete account', error);
          alert('Failed to delete account. Please try again.');
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
    <div className="max-w-2xl mx-auto mt-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="space-y-6">
          {/* Account Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Account Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {user?.username}</p>
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Security</h2>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>

            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Update Password
                </button>
              </form>
            )}
          </div>

          {/* Account Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Account Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Sign Out
              </button>
              
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
