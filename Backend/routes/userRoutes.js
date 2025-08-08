const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser, followUnfollowUser, searchUsers, changePassword, deleteAccount } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protect, followUnfollowUser);
router.get('/search', protect, searchUsers);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
