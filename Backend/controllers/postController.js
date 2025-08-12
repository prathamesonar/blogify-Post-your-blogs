
const Post = require('../models/postModel');
const User = require('../models/userModel');

// Create a new post
const createPost = async (req, res) => {
    // Image upload logic with Cloudinary would go here
    const { text, image } = req.body;
    if (!text) {
        return res.status(400).json({ message: "Post must have some text" });
    }
    try {
        const newPost = new Post({ user: req.user._id, text, image });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get feed posts (for the current user)
const getFeedPosts = async (req, res) => {
    try {
        // Show ALL posts from other users (excluding current user's posts)
        const feedPosts = await Post.find({ 
            user: { $ne: req.user._id } 
        }).sort({ createdAt: -1 }).populate('user', 'name username profilePic');
        
        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's own posts
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name username profilePic');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like/Unlike a post
const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const isLiked = post.likes.includes(req.user._id);
        
        if (isLiked) {
            post.likes.pull(req.user._id);
        } else {
            post.likes.push(req.user._id);
        }
        
        await post.save();
        
        const updatedPost = await Post.findById(post._id)
            .populate('user', 'name username profilePic')
            .populate('comments.user', 'name username profilePic');
        
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Comment on a post
const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = { 
            user: req.user._id, 
            text: text 
        };

        post.comments.push(comment);
        await post.save();
        
        // Crucial Fix: After saving, re-fetch and populate the post
        // This ensures the new comment includes the user's details.
        const updatedPost = await Post.findById(post._id)
            .populate('user', 'name username profilePic')
            .populate('comments.user', 'name username profilePic'); 
        
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this post" });
    }
    
    const { text, image } = req.body;
    
    post.text = text || post.text;
    post.image = image || post.image;
    
    const updatedPost = await post.save();
    
    // Populate the user field to maintain consistent data structure
    const populatedPost = await Post.findById(updatedPost._id)
      .populate('user', 'name username profilePic');
    
    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getFeedPosts, getMyPosts, likeUnlikePost, commentOnPost, updatePost, deletePost };
