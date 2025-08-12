import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import PostMenu from './PostMenu';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onLike, onComment, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [internalPost, setInternalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  // This useEffect ensures the component's state stays in sync with props
  useEffect(() => {
    setInternalPost(post);
  }, [post]);

  const isLiked = internalPost.likes?.includes(user?._id);
  const isOwner = internalPost.user?._id === user?._id;

  const commentsRef = useRef(null);
  const commentButtonRef = useRef(null);

  const handleComment = async () => {
    if (commentText.trim()) {
      try {
        // We now expect onComment to return the updated post
        const updatedPost = await onComment(internalPost._id, commentText);
        if (updatedPost) {
          setInternalPost(updatedPost); // Update local state with the server's response
        }
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
      setCommentText('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showComments && 
          commentsRef.current && 
          !commentsRef.current.contains(event.target) &&
          commentButtonRef.current &&
          !commentButtonRef.current.contains(event.target)) {
        setShowComments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showComments]);

  if (!internalPost || !internalPost.user) {
    // Render a loading state or null if post data is not ready
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to={`/profile/${internalPost.user.username}`}>
            <div className="relative group">
              {internalPost.user.profilePic ? (
                <img
                  src={internalPost.user.profilePic}
                  alt={internalPost.user.name}
                  className="w-12 h-12 rounded-2xl mr-4 cursor-pointer group-hover:scale-105 transition-transform duration-200 shadow-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl mr-4 cursor-pointer group-hover:scale-105 transition-transform duration-200 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {internalPost.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${internalPost.user.username}`}>
              <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200 text-lg">
                {internalPost.user.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 font-medium">@{internalPost.user.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-xs text-gray-400">
            {internalPost.createdAt ? formatDistanceToNow(new Date(internalPost.createdAt), { addSuffix: true }) : ''}
          </p>
          {isOwner && (
            <PostMenu 
              post={internalPost} 
              onEdit={onEdit} 
              onDelete={() => onDelete(internalPost._id)} 
            />
          )}
        </div>
      </div>
      
      {/* Post Content & Actions... */}
      {/* (The rest of your JSX remains the same, just ensure it uses `internalPost` instead of `post`) */}
      <div className="mb-4">
        <div 
          className="text-gray-800 leading-relaxed text-lg mb-4 prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: internalPost.text }}
        />
      </div>

      <div className="flex items-center justify-between text-gray-500 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => onLike(internalPost._id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-50 group ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart 
              size={20} 
              fill={isLiked ? 'currentColor' : 'none'} 
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="font-medium">{internalPost.likes?.length || 0}</span>
          </button>
          
          <button 
            ref={commentButtonRef}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-blue-50 hover:text-blue-500 group"
          >
            <MessageCircle 
              size={20}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="font-medium">{internalPost.comments?.length || 0}</span>
          </button>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div ref={commentsRef} className="mt-6 pt-6 border-t border-gray-100">
          {internalPost.comments && internalPost.comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {internalPost.comments.map((comment) => (
                <div 
                  key={comment._id}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {(comment.user?.name || 'User').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {comment.user?.name || 'User'}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Comment */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold">
                  {(user?.name || 'You').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a thoughtful comment..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
