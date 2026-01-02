const Book = require('../models/Book');

// @desc    Get user's library (books)
// @route   GET /api/users/:id/library
// @access  Private
const getUserLibrary = async (req, res) => {
    try {
        const books = await Book.find({ user: req.params.id })
            .sort({ dateAdded: -1 })
            .limit(20);

        res.json(books);
    } catch (error) {
        console.error('Get user library error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserLibrary };
