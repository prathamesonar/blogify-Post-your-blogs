import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../styles/rich-editor.css';
import { createPost } from '../services/postService';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      setError('Post cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: newPost } = await createPost({
        text: content,
        plainText: plainText
      });

      onPostCreated(newPost);
      setContent('');
      setError('');
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8 max-w-2xl mx-auto">
  <form onSubmit={handleSubmit}>
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-900 mb-4">
        What's on your mind?
      </label>
      <div className="rich-editor-container rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Share your thoughts..."
        />
      </div>
    </div>

    {error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 text-sm font-medium">{error}</p>
      </div>
    )}

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
        💡 Use the toolbar to style your text with bold, italic, links, and more!
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 shadow-sm transform hover:-translate-y-0.5 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-md'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Posting...</span>
          </div>
        ) : (
          'Share Post'
        )}
      </button>
    </div>
  </form>
</div>
  );
};

export default CreatePost;
