const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllPosts,
    getDashboardStats,
    deleteUser,
    deletePostAdmin,
    getUserById,
    getPostById,
    getSystemAnalytics
} = require('../controllers/adminController');

// Admin dashboard routes
router.get('/admin/users', getAllUsers);
router.get('/admin/posts', getAllPosts);
router.get('/admin/stats', getDashboardStats);
router.get('/admin/analytics', getSystemAnalytics);

// Admin detailed routes
router.get('/admin/users/:userId', getUserById);
router.get('/admin/posts/:postId', getPostById);

// Admin delete routes
router.delete('/admin/users/:userId', deleteUser);
router.delete('/admin/posts/:postId', deletePostAdmin);

module.exports = router;
