const Book = require('../models/Book');

// @desc    Get user books
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id }).sort({ dateAdded: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBook = async (req, res) => {
    try {
        // Check if ID is a valid MongoDB ObjectId to avoid CastError
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Book not found (Invalid ID)' });
        }

        const book = await Book.findById(req.params.id);

        if (book && book.user.toString() === req.user.id) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ message: 'Please add a title' });
        }

        const book = await Book.create({
            user: req.user.id,
            ...req.body
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check for user
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check for user
        if (book.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await book.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get community data for a book (avg rating, reviews)
// @route   GET /api/books/community/:googleId
// @access  Private
const getCommunityData = async (req, res) => {
    try {
        const { googleId } = req.params;

        // Find all entries for this book (excluding current user if you want, but including is fine too)
        const books = await Book.find({ googleId }).populate('user', 'username');

        if (!books.length) {
            return res.status(200).json({
                averageRating: 0,
                ratingCount: 0,
                reviews: []
            });
        }

        // Calculate average rating
        const ratedBooks = books.filter(b => b.rating && b.rating > 0);
        const totalRating = ratedBooks.reduce((acc, b) => acc + b.rating, 0);
        const averageRating = ratedBooks.length > 0 ? (totalRating / ratedBooks.length).toFixed(1) : 0;

        // Collect reviews
        const reviews = books
            .filter(b => b.personalReview && b.personalReview.trim().length > 0)
            .map(b => ({
                _id: b._id,
                username: b.user.username,
                rating: b.rating,
                text: b.personalReview,
                date: b.dateCompleted || b.dateAdded
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

        res.status(200).json({
            averageRating: parseFloat(averageRating),
            ratingCount: ratedBooks.length,
            reviews
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trending books (most added + highest rated)
// @route   GET /api/books/trending
// @access  Private
const getTrendingBooks = async (req, res) => {
    try {
        const trending = await Book.aggregate([
            {
                $group: {
                    _id: "$googleId", // Group by unique Google Book ID
                    count: { $sum: 1 }, // Count how many users have this book
                    averageRating: { $avg: "$rating" }, // Calculate average rating
                    title: { $first: "$title" },
                    authors: { $first: "$authors" },
                    imageLinks: { $first: "$imageLinks" },
                    category: { $first: { $arrayElemAt: ["$categories", 0] } } // Keep one category
                }
            },
            {
                $sort: { count: -1, averageRating: -1 } // Sort by popularity then rating
            },
            {
                $limit: 5 // Limit to top 5
            }
        ]);

        res.status(200).json(trending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle like on a book
// @route   PUT /api/books/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if book has already been liked
        const index = book.likes.indexOf(req.user.id);

        if (index === -1) {
            // Like
            book.likes.push(req.user.id);
        } else {
            // Unlike
            book.likes.splice(index, 1);
        }

        await book.save();
        res.status(200).json(book.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    getCommunityData,
    getTrendingBooks,
    toggleLike
};

