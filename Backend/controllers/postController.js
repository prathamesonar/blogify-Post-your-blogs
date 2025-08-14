const Post = require('../models/postModel');
const User = require('../models/userModel');
// Create a new post
exports.createPost = async (req, res) => {
    // ... (keep the existing function code here)
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

// Get feed posts
exports.getFeedPosts = async (req, res) => {
    try {
        // This finds all posts where the 'user' is "not equal" ($ne) to the logged-in user's ID.
        const feedPosts = await Post.find({
            user: { $ne: req.user._id }
        })
        .sort({ createdAt: -1 })
        .populate('user', 'name username profilePic')
        .populate('comments.user', 'name username profilePic');

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's own posts
exports.getMyPosts = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const posts = await Post.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name username profilePic')
            .populate('comments.user', 'name username profilePic');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like/Unlike a post
exports.likeUnlikePost = async (req, res) => {
    // ... (keep the existing function code here)
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
exports.commentOnPost = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }
        const comment = { user: req.user._id, text: text };
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: comment } },
            { new: true }
        )
        .populate('user', 'name username profilePic')
        .populate('comments.user', 'name username profilePic');
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
  // ... (keep the existing function code here)
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this post" });
    }
    const { text, image } = req.body;
    post.text = text || post.text;
    post.image = image || post.image;
    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id)
      .populate('user', 'name username profilePic');
    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  // ... (keep the existing function code here)
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
