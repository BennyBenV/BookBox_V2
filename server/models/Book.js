const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    googleId: { type: String },
    title: { type: String, required: [true, 'Please add a title'] },
    authors: [{ type: String }],
    description: { type: String },
    categories: [{ type: String }],
    publishedDate: { type: String },
    pageCount: { type: Number },
    imageLinks: {
        thumbnail: String,
        smallThumbnail: String
    },
    readingStatus: {
        type: String,
        enum: ['TO_READ', 'READING', 'COMPLETED'],
        default: 'TO_READ'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    personalReview: { type: String },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateCompleted: { type: Date },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Book', BookSchema);
