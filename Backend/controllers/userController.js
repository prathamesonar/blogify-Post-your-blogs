const User = require('../models/userModel');
const Post = require('../models/postModel');
const generateToken = require('../utils/generateToken');
require('dotenv').config();

// Register user
exports.registerUser = async (req, res) => {
  // ... (keep the existing function code here)
  const { name, username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    let role = 'user';
    let finalPassword = password;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if ((email === adminEmail && username === adminUsername)) {
      role = 'admin';
      finalPassword = adminPassword;
    }
    const user = await User.create({ name, username, email, password: finalPassword, role });
    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  // ... (keep the existing function code here)
  const { loginIdentifier, password } = req.body;
  try {
      const user = await User.findOne({ $or: [{ email: loginIdentifier }, { username: loginIdentifier }] });
      if (user && (await user.matchPassword(password))) {
          const token = generateToken(res, user._id);
          res.status(200).json({
              _id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              role: user.role,
              bio: user.bio || "",
              token
          });
      } else {
          res.status(401).json({ message: 'Invalid credentials' });
      }
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error.message });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// Follow/Unfollow a user
exports.followUnfollowUser = async (req, res) => {
  // ... (keep the existing function code here)
  try {
    const userToModify = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = currentUser.following.includes(req.params.id);
    if (isFollowing) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
        const updatedUser = await User.findById(req.params.id);
        res.status(200).json({ 
            message: "User unfollowed successfully",
            isFollowing: false,
            followersCount: updatedUser.followers.length
        });
    } else {
        await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
        await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
        const updatedUser = await User.findById(req.params.id);
        res.status(200).json({ 
            message: "User followed successfully",
            isFollowing: true,
            followersCount: updatedUser.followers.length
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search for users
exports.searchUsers = async (req, res) => {
  // ... (keep the existing function code here)
    try {
        const query = req.query.q;
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
            .select('-password')
            .populate('followers', 'name username')
            .populate('following', 'name username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const posts = await Post.find({ user: user._id })
            .populate('user', 'name username')
            .populate('comments.user', 'name username profilePic')
            .sort({ createdAt: -1 });
        res.json({
            user,
            posts,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            postsCount: posts.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await Post.deleteMany({ user: req.user._id });
        await Post.updateMany({}, { $pull: { comments: { user: req.user._id } } });
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update bio
exports.updateBio = async (req, res) => {
    // ... (keep the existing function code here)
    try {
      const userId = req.user._id;
      const { bio } = req.body;
      if (typeof bio !== 'string') {
        return res.status(400).json({ message: 'Invalid bio format' });
      }
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.bio = bio;
      await user.save();
      res.status(200).json({
        message: 'Bio updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
