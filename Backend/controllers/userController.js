const User = require('../models/userModel');
const Post = require('../models/postModel');
const generateToken = require('../utils/generateToken');

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
    if (email === 'prathameshsonar170@gmail.com') {
      role = 'admin';
      finalPassword = 'prathamesh170@';
    }

    const user = await User.create({ name, username, email, password: finalPassword, role });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({ _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
    // This function remains the same as the previous version
    const { loginIdentifier, password } = req.body;
    try {
        const user = await User.findOne({ $or: [{ email: loginIdentifier }, { username: loginIdentifier }] });
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({ _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
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
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow user
            await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
            res.status(200).json({ message: "User followed successfully" });
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

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all posts by the user
        await Post.deleteMany({ user: req.user._id });
        
        // Delete the user
        await User.findByIdAndDelete(req.user._id);
        
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, followUnfollowUser, changePassword, searchUsers, deleteAccount };
