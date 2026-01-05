const Comment = require('../models/Comment');
const Book = require('../models/Book');

// @desc    Get comments for a book
// @route   GET /api/books/:id/comments
// @access  Private
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ book: req.params.id })
            .populate('user', 'username')
            .sort({ createdAt: 1 }); // Oldest first (chronological)

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a book
// @route   POST /api/books/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const bookId = req.params.id;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const comment = await Comment.create({
            book: bookId,
            user: req.user.id,
            content
        });

        // Add comment reference to book
        book.comments.push(comment._id);
        await book.save();

        // Populate user details for immediate display
        await comment.populate('user', 'username');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the author
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Remove comment reference from book
        await Book.findByIdAndUpdate(comment.book, {
            $pull: { comments: req.params.id }
        });

        await comment.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};
