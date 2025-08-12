const User = require('../models/userModel');
const Post = require('../models/postModel');
const generateToken = require('../utils/generateToken');
require('dotenv').config();

// Register user
const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Admin user creation logic
    let role = 'user';
    let finalPassword = password;
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if the user is the admin
    if ((email === adminEmail && username === adminUsername)) {
      role = 'admin';
      finalPassword = adminPassword; // Use admin password from env
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
const loginUser = async (req, res) => {
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
const logoutUser = (req, res) => {
    // This function remains the same
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

// Follow/Unfollow a user
const followUnfollowUser = async (req, res) => {
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
            // Unfollow user
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
            
            // Get updated user data
            const updatedUser = await User.findById(req.params.id);
            res.status(200).json({ 
                message: "User unfollowed successfully",
                isFollowing: false,
                followersCount: updatedUser.followers.length
            });
        } else {
            // Follow user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
            
            // Get updated user data
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
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search for users
const searchUsers = async (req, res) => {
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
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password')
            .populate('followers', 'name username')
            .populate('following', 'name username');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const posts = await Post.find({ user: user._id })
            .populate('user', 'name username')
            .populate('comments.user', 'name username profilePic') // <-- ADD THIS LINE
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

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all posts by the user
        await Post.deleteMany({ user: req.user._id });

        // Remove all comments by the user from all posts
        await Post.updateMany({}, { $pull: { comments: { user: req.user._id } } });
        
        // Delete the user
        await User.findByIdAndDelete(req.user._id);
        
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBio = async (req, res) => {
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
        user // send the updated user object
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
module.exports = { registerUser, loginUser, logoutUser, followUnfollowUser, changePassword, searchUsers, getUserByUsername, deleteAccount, updateBio };
