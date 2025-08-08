import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import PostMenu from './PostMenu';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, onLike, onComment, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isLiked = post.likes?.includes(user?._id);
  const isOwner = post.user?._id === user?._id;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img
            src={post.user?.profilePic || '/default-avatar.png'}
            alt={post.user?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
            <p className="text-sm text-gray-500">@{post.user?.username}</p>
          </div>
        </div>
        {isOwner && (
          <PostMenu 
            postId={post._id} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        )}
      </div>
      
      <p className="text-gray-800 mb-3">{post.text}</p>
      
      {post.image && (
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full rounded-lg mb-3"
        />
      )}
      
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onLike(post._id)}
            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{post.likes?.length || 0}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1"
          >
            <MessageCircle size={20} />
            <span>{post.comments?.length || 0}</span>
          </button>
          
          <button className="flex items-center space-x-1">
            <Share2 size={20} />
          </button>
        </div>
      </div>
      
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-3">
            {post.comments?.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-semibold">{comment.user?.name || 'User'}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="2"
            />
            <button
              onClick={handleComment}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
