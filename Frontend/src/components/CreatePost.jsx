import React, { useState } from 'react';
import postService from '../services/postService';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Post cannot be empty.');
      return;
    }
    try {
      const { data: newPost } = await postService.createPost({ text });
      onPostCreated(newPost); // Pass the new post up to the parent
      setText('');
      setError('');
    } catch (err) {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-between items-center mt-2">
          {/* Placeholder for image upload button */}
          <button type="button" className="text-gray-500 hover:text-gray-700">
            {/* Icon for image upload can go here */}
            Add Image
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
