const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        
        // FIX: Use a case-insensitive regular expression for the search
        const user = await User.findOne({ 
            username: { $regex: new RegExp('^' + username + '$', 'i') } 
        })
        .select('-password')
        .populate('followers', 'name username')
        .populate('following', 'name username');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get user's posts
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
