const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser, followUnfollowUser, searchUsers, getUserByUsername, changePassword, deleteAccount, updateBio } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protect, followUnfollowUser);
router.get('/search', protect, searchUsers);
router.get('/:username', getUserByUsername);
router.put('/change-password', protect, changePassword);
router.put('/update-bio', protect, updateBio);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
