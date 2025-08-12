const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the whole controller

// Use the controller methods directly
router.get('/admin/users', adminController.getAllUsers);
router.get('/admin/posts', adminController.getAllPosts);
router.get('/admin/stats', adminController.getDashboardStats);
router.get('/admin/analytics', adminController.getSystemAnalytics);

router.get('/admin/users/:userId', adminController.getUserById);
router.get('/admin/posts/:postId', adminController.getPostById);

router.delete('/admin/users/:userId', adminController.deleteUser);
router.delete('/admin/posts/:postId', adminController.deletePostAdmin);

module.exports = router;
