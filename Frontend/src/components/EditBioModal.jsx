import React, { useState, useEffect } from 'react';

const EditBioModal = ({ isOpen, onClose, currentBio, onSave }) => {
  const [bio, setBio] = useState(currentBio || '');

  useEffect(() => {
    setBio(currentBio || '');
  }, [currentBio]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(bio);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-8 w-full max-w-md transform transition-all duration-300 scale-100">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Bio</h2>
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      rows={5}
      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
      placeholder="Write your bio here..."
    />
    <div className="mt-6 flex justify-end space-x-4">
      <button
        onClick={onClose}
        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>
  );
};

export default EditBioModal;
