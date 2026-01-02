const axios = require('axios');

// @desc    Search books from Google Books API
// @route   GET /api/search
// @access  Private
const searchGoogleBooks = async (req, res) => {
    const { q, startIndex = 0, maxResults = 20, orderBy = 'relevance' } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Please provide a search query' });
    }

    try {
        // Using Google Books Public API (No key needed for low usage, but recommended for prod)
        // Ensure you have an API KEY in .env if you hit limits: &key=${process.env.GOOGLE_BOOKS_API_KEY}
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=${orderBy}&key=${process.env.GOOGLE_BOOKS_API_KEY || ''}`);

        const formattedBooks = response.data.items ? response.data.items.map(item => {
            const info = item.volumeInfo;
            return {
                googleId: item.id,
                title: info.title,
                authors: info.authors || ['Unknown'],
                description: info.description,
                categories: info.categories,
                publishedDate: info.publishedDate,
                pageCount: info.pageCount,
                imageLinks: {
                    thumbnail: info.imageLinks?.thumbnail,
                    smallThumbnail: info.imageLinks?.smallThumbnail
                }
            };
        }) : [];

        res.json({
            items: formattedBooks,
            totalItems: response.data.totalItems || 0
        });
    } catch (error) {
        console.error('Google Books API Error:', error.message);
        res.status(500).json({ message: 'Error fetching data from Google Books' });
    }
};

// @desc    Get book details from Google Books API
// @route   GET /api/search/:id
// @access  Private
const getGoogleBookDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const info = response.data.volumeInfo;

        const formattedBook = {
            googleId: response.data.id,
            title: info.title,
            authors: info.authors || ['Unknown'],
            description: info.description,
            categories: info.categories,
            publishedDate: info.publishedDate,
            pageCount: info.pageCount,
            imageLinks: {
                thumbnail: info.imageLinks?.thumbnail,
                smallThumbnail: info.imageLinks?.smallThumbnail,
                large: info.imageLinks?.large || info.imageLinks?.thumbnail // Try to get larger image
            }
        };

        res.json(formattedBook);
    } catch (error) {
        console.error('Google Books API Error:', error.message);
        res.status(500).json({ message: 'Error fetching book details from Google Books' });
    }
};

module.exports = { searchGoogleBooks, getGoogleBookDetails };
