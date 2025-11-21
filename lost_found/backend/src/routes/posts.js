const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  claimPost,
  getMyPosts,
  getMatches,
  getClaimAttempts,
  createPostValidation
} = require('../controllers/postController');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getPosts);
router.get('/my-posts', auth, getMyPosts);
router.get('/:id/claim-attempts', auth, getClaimAttempts);
router.get('/:id', auth, getPostById);
router.post('/', auth, upload.single('image'), createPostValidation, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:foundId/claim', auth, claimPost);
router.get('/:postId/matches', auth, getMatches);

module.exports = router;
