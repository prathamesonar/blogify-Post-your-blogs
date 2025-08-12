const User = require('../models/userModel');
const Post = require('../models/postModel');

// Get all users with complete details
exports.getAllUsers = async (req, res) => {
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
                { $project: { likesCount: { $size: { $ifNull: ['$likes', []] } } } },
                { $group: { _id: null, totalLikes: { $sum: '$likesCount' } } }
            ]);
            
            return {
                ...user.toObject(),
                postsCount,
                followersCount: user.followers?.length || 0,
                followingCount: user.following?.length || 0,
                totalLikes: totalLikes[0]?.totalLikes || 0
            };
        }));
        
        res.status(200).json({
            users: usersWithStats,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts with complete details
exports.getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        const searchQuery = search ? { text: { $regex: search, $options: 'i' } } : {};

        const posts = await Post.find(searchQuery)
            .populate('user', 'name username profilePic email createdAt')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip(skip);

        const totalPosts = await Post.countDocuments(searchQuery);
        
        const postsWithStats = posts.map(post => ({
            ...post.toObject(),
            likesCount: post.likes?.length || 0,
            commentsCount: post.comments?.length || 0
        }));
        
        res.status(200).json({
            posts: postsWithStats,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: parseInt(page),
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comprehensive dashboard stats
exports.getDashboardStats = async (req, res) => {
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
            { $project: { text: 1, user: 1, createdAt: 1, likesCount: { $size: { $ifNull: ['$likes', []] } } } },
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

// Get single user details
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single post details
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get system analytics
exports.getSystemAnalytics = async (req, res) => {
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
            { $project: { name: 1, username: 1, followersCount: { $size: { $ifNull: ['$followers', []] } } } },
            { $sort: { followersCount: -1 } },
            { $limit: 10 }
        ]);
        
        const topPostsByLikes = await Post.aggregate([
            { $project: { text: 1, user: 1, likesCount: { $size: { $ifNull: ['$likes', []] } } } },
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

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await Post.deleteMany({ user: userId });
        await User.updateMany({}, { $pull: { followers: userId, following: userId } });
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post (admin only)
exports.deletePostAdmin = async (req, res) => {
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
