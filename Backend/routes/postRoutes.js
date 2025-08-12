const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController'); // Import the whole controller

// Use the controller methods directly
router.post('/', protect, postController.createPost);
router.get('/feed', protect, postController.getFeedPosts);
router.get('/my-posts', protect, postController.getMyPosts);
router.post('/like/:id', protect, postController.likeUnlikePost);
router.post('/comment/:id', protect, postController.commentOnPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;
