const User = require('../models/userModel');
const Post = require('../models/postModel');

// Get all users with complete details
const getAllUsers = async (req, res) => {
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

// Get all posts with complete details
const getAllPosts = async (req, res) => {
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

// Get comprehensive dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        
        // Get users created in last 7 days
        const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsers7Days = await User.countDocuments({ createdAt: { $gte: last7Days } });
        
        // Get posts created in last 7 days
        const newPosts7Days = await Post.countDocuments({ createdAt: { $gte: last7Days } });
        
        // Get most active users (by posts)
        const mostActiveUsers = await Post.aggregate([
            { $group: { _id: '$user', postsCount: { $sum: 1 } } },
            { $sort: { postsCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { username: '$user.username', name: '$user.name', postsCount: 1 } }
        ]);
        
        // Get most liked posts
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

// Get single user details
const getUserById = async (req, res) => {
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

// Get single post details
const getPostById = async (req, res) => {
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
const getSystemAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        
        // User growth by month
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        // Post growth by month
        const postGrowth = await Post.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        // Top users by followers
        const topUsersByFollowers = await User.aggregate([
            { $project: { followersCount: { $size: '$followers' }, name: 1, username: 1 } },
            { $sort: { followersCount: -1 } },
            { $limit: 10 }
        ]);
        
        // Top posts by likes
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

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Delete all posts by this user
        await Post.deleteMany({ user: userId });
        
        // Remove user from followers/following lists
        await User.updateMany(
            { $or: [{ followers: userId }, { following: userId }] },
            { $pull: { followers: userId, following: userId } }
        );
        
        // Delete the user
        await User.findByIdAndDelete(userId);
        
        res.status(200).json({ message: 'User and all associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post (admin only)
const deletePostAdmin = async (req, res) => {
    try {
        const { postId } = req.params;
        
        await Post.findByIdAndDelete(postId);
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllPosts,
    getDashboardStats,
    getUserById,
    getPostById,
    getSystemAnalytics,
    deleteUser,
    deletePostAdmin
};
