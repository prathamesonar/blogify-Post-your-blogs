const User = require('../models/userModel');
const Post = require('../models/postModel');

// Get all users
exports.getAllUsers = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;
        const searchQuery = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};
        const users = await User.find(searchQuery)
            .select('-password')
            .populate('followers', 'name username profilePic email')
            .populate('following', 'name username profilePic email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip(skip);
        const totalUsers = await User.countDocuments(searchQuery);
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const postsCount = await Post.countDocuments({ user: user._id });
            const totalLikes = await Post.aggregate([
                { $match: { user: user._id } },
                { $project: { likesCount: { $size: '$likes' } } },
                { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
            ]);
            return {
                ...user.toObject(),
                postsCount,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                totalLikes: totalLikes[0]?.totalLikes || 0
            };
        }));
        res.status(200).json({
            users: usersWithStats,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;
        const searchQuery = search ? {
            $or: [
                { text: { $regex: search, $options: 'i' } }
            ]
        } : {};
        const posts = await Post.find(searchQuery)
            .populate('user', 'name username profilePic email createdAt')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip(skip);
        const totalPosts = await Post.countDocuments(searchQuery);
        const postsWithStats = posts.map(post => ({
            ...post.toObject(),
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        }));
        res.status(200).json({
            posts: postsWithStats,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers7Days = await User.countDocuments({ createdAt: { $gte: last7Days } });
        const newPosts7Days = await Post.countDocuments({ createdAt: { $gte: last7Days } });
        const mostActiveUsers = await Post.aggregate([
            { $group: { _id: '$user', postsCount: { $sum: 1 } } },
            { $sort: { postsCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', name: '$user.name', postsCount: 1 } }
        ]);
        const mostLikedPosts = await Post.aggregate([
            { $project: { likesCount: { $size: '$likes' }, user: 1, text: 1, createdAt: 1 } },
            { $sort: { likesCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', name: '$user.name', text: 1, likesCount: 1, createdAt: 1 } }
        ]);
        res.status(200).json({
            totalUsers,
            totalPosts,
            newUsers7Days,
            newPosts7Days,
            mostActiveUsers,
            mostLikedPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .select('-password')
            .populate('followers', 'name username profilePic email')
            .populate('following', 'name username profilePic email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userPosts = await Post.find({ user: userId })
            .populate('user', 'name username profilePic')
            .sort({ createdAt: -1 });
        const userStats = {
            ...user.toObject(),
            postsCount: userPosts.length,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            posts: userPosts
        };
        res.status(200).json(userStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('user', 'name username profilePic email')
            .populate('likes', 'name username profilePic')
            .populate('comments.user', 'name username profilePic');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const postStats = {
            ...post.toObject(),
            likesCount: post.likes.length,
            commentsCount: post.comments.length
        };
        res.status(200).json(postStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get system analytics
exports.getSystemAnalytics = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const userGrowth = await User.aggregate([
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        const postGrowth = await Post.aggregate([
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        const topUsersByFollowers = await User.aggregate([
            { $project: { followersCount: { $size: '$followers' }, name: 1, username: 1 } },
            { $sort: { followersCount: -1 } },
            { $limit: 10 }
        ]);
        const topPostsByLikes = await Post.aggregate([
            { $project: { likesCount: { $size: '$likes' }, text: 1, user: 1 } },
            { $sort: { likesCount: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { text: 1, likesCount: 1, username: '$user.username', name: '$user.name' } }
        ]);
        res.status(200).json({
            totalUsers,
            totalPosts,
            userGrowth,
            postGrowth,
            topUsersByFollowers,
            topPostsByLikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { userId } = req.params;
        await Post.deleteMany({ user: userId });
        await User.updateMany(
            { $or: [{ followers: userId }, { following: userId }] },
            { $pull: { followers: userId, following: userId } }
        );
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User and all associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post
exports.deletePostAdmin = async (req, res) => {
    // ... (keep the existing function code here)
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
