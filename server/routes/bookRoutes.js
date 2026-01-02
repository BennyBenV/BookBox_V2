const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    getCommunityData,
    getTrendingBooks,
    toggleLike
} = require('../controllers/bookController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/trending', protect, getTrendingBooks);
router.get('/community/:googleId', protect, getCommunityData);
router.route('/').get(protect, getBooks).post(protect, addBook);
router.route('/:id').get(protect, getBook).put(protect, updateBook).delete(protect, deleteBook);

// Social routes
router.put('/:id/like', protect, toggleLike);
router.route('/:id/comments').get(protect, getComments).post(protect, addComment);

module.exports = router;
