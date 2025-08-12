import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import PostMenu from './PostMenu';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onLike, onComment, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isLiked = post.likes?.includes(user?._id);
  const isOwner = post.user?._id === user?._id;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const commentsRef = useRef(null);
  const commentButtonRef = useRef(null);

  // Simplified handler to prevent race conditions
  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText(''); // Clear input after submission
    }
  };

  // Handle click outside to close comments
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showComments &&
        commentsRef.current &&
        !comments-ref.current.contains(event.target) &&
        commentButtonRef.current &&
        !commentButtonRef.current.contains(event.target)
      ) {
        setShowComments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showComments]);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to={`/profile/${post.user?.username}`}>
            <div className="relative group">
              {post.user?.profilePic ? (
                <img
                  src={post.user.profilePic}
                  alt={post.user?.name}
                  className="w-12 h-12 rounded-2xl mr-4 cursor-pointer group-hover:scale-105 transition-transform duration-200 shadow-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl mr-4 cursor-pointer group-hover:scale-105 transition-transform duration-200 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.user?.username}`}>
              <h3 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200 text-lg">
                {post.user?.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 font-medium">@{post.user?.username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-xs text-gray-400">
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
          </p>
          {isOwner && (
            <PostMenu
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <div
          className="text-gray-800 leading-relaxed text-lg mb-4 prose prose-lg max-w-none max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          dangerouslySetInnerHTML={{ __html: post.text }}
        />

        {post.image && (
          <div className="relative group">
            <img
              src={post.image}
              className="w-full rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between text-gray-500 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onLike(post._id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-50 group ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart
              size={20}
              fill={isLiked ? 'currentColor' : 'none'}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="font-medium">{post.likes?.length || 0}</span>
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
            <span className="font-medium">{post.comments?.length || 0}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-green-50 hover:text-green-500 group">
            <Share2
              size={20}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div ref={commentsRef} className="mt-6 pt-6 border-t border-gray-100">
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-4 mb-6">
              {post.comments.map((comment) => (
                <div
                  key={comment._id} // FIX: Use the unique comment ID for the key
                  className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200"
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
                  className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  rows="3"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-200" />
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
