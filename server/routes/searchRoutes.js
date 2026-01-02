const express = require('express');
const router = express.Router();
const { searchGoogleBooks, getGoogleBookDetails } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, searchGoogleBooks);
router.get('/:id', protect, getGoogleBookDetails);

module.exports = router;
