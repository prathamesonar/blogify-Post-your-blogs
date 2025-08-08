import React, { useState } from 'react';
import { MoreVertical, Edit3, Trash2 } from 'lucide-react';

const PostMenu = ({ postId, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1"
      >
        <MoreVertical size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            onClick={() => {
              onEdit(postId);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Post
          </button>
          <button
            onClick={() => {
              onDelete(postId);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostMenu;
