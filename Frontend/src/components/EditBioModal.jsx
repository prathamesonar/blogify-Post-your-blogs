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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Bio</h2>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Write your bio here..."
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBioModal;
