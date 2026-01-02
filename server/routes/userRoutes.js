const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    searchUsers,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getUserLibrary,
    getUserFeed
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers);
router.get('/feed', protect, getUserFeed);
router.get('/:id', protect, getUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);
router.get('/:id/library', protect, getUserLibrary);

module.exports = router;
