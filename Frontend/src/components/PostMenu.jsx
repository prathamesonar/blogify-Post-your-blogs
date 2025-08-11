import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Trash2 } from 'lucide-react';

const PostMenu = ({ post, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
      >
        <MoreVertical size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit(post);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 first:rounded-t-lg"
            >
              <Edit3 size={16} className="mr-3 text-indigo-500" />
              Edit Post
            </button>
            <button
              onClick={() => {
                onDelete(post);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 last:rounded-b-lg"
            >
              <Trash2 size={16} className="mr-3" />
              Delete Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostMenu;