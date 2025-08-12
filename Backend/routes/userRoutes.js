const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // Import the whole controller

// Use the controller methods directly
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/follow/:id', protect, userController.followUnfollowUser);
router.get('/search', protect, userController.searchUsers);
router.get('/:username', userController.getUserByUsername);
router.put('/change-password', protect, userController.changePassword);
router.put('/update-bio', protect, userController.updateBio);
router.delete('/delete-account', protect, userController.deleteAccount);

module.exports = router;
