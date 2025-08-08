const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPost, getFeedPosts, getMyPosts, likeUnlikePost, commentOnPost, updatePost, deletePost } = require('../controllers/postController');

router.post('/', protect, createPost);
router.get('/feed', protect, getFeedPosts);
router.get('/my-posts', protect, getMyPosts);
router.post('/like/:id', protect, likeUnlikePost);
router.post('/comment/:id', protect, commentOnPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
