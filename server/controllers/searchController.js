const axios = require('axios');

// @desc    Search books from Open Library API
// @route   GET /api/search
// @access  Private
const searchRemoteBooks = async (req, res) => {
    const { q, startIndex = 0, maxResults = 20 } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Please provide a search query' });
    }

    // Open Library requires at least 3 characters
    if (q.length < 3) {
        return res.json({ items: [], totalItems: 0 });
    }

    try {
        // Open Library uses pages (1-based), not startIndex. 
        // Default limit is usually 100, we can use 'limit' param if needed, but 'page' is main way.
        // Assuming maxResults ~ 20 (standard page size for UI).
        const page = Math.floor(startIndex / 20) + 1;

        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&page=${page}&limit=${maxResults}`);

        const formattedBooks = response.data.docs ? response.data.docs.map(item => {
            // Filter out items without basic info if needed?
            // Construct Cover URL
            let imageLinks = { thumbnail: null, smallThumbnail: null, large: null };
            if (item.cover_i) {
                imageLinks = {
                    thumbnail: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`,
                    smallThumbnail: `https://covers.openlibrary.org/b/id/${item.cover_i}-S.jpg`,
                    large: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
                };
            }

            // ID is usually "/works/OL123W". We strip "/works/"
            const id = item.key.replace('/works/', '');

            return {
                googleId: id, // Keeping param name 'googleId' for frontend compatibility
                title: item.title,
                authors: item.author_name || ['Unknown'],
                description: item.first_sentence ? item.first_sentence[0] : null, // Search results rarely have full desc
                categories: item.subject ? item.subject.slice(0, 3) : [],
                publishedDate: item.first_publish_year ? item.first_publish_year.toString() : 'Unknown',
                pageCount: item.number_of_pages_median || 0,
                imageLinks: imageLinks
            };
        }) : [];

        res.json({
            items: formattedBooks,
            totalItems: response.data.numFound || 0
        });
    } catch (error) {
        console.error('Open Library API Error:', error.message);
        res.status(500).json({ message: 'Error fetching data from Open Library' });
    }
};

// @desc    Get book details from Open Library API
// @route   GET /api/search/:id
// @access  Private
const getRemoteBookDetails = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch Work details
        const response = await axios.get(`https://openlibrary.org/works/${id}.json`);
        const data = response.data;

        // Fetch Author details (needed because Work only has author key)
        let authors = ['Unknown'];
        if (data.authors && data.authors.length > 0) {
            try {
                // Fetch only the first author to save time/bandwidth
                const authorId = data.authors[0].author.key;
                const authorResponse = await axios.get(`https://openlibrary.org${authorId}.json`);
                authors = [authorResponse.data.name];
            } catch (err) {
                console.log('Error fetching author details', err.message);
            }
        }

        // Description can be string or object {type: 'text', value: '...'}
        let description = '';
        if (typeof data.description === 'string') {
            description = data.description;
        } else if (data.description && data.description.value) {
            description = data.description.value;
        }

        // Covers
        let imageLinks = { thumbnail: null, large: null };
        if (data.covers && data.covers.length > 0) {
            const coverId = data.covers[0];
            imageLinks = {
                thumbnail: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
                smallThumbnail: `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`,
                large: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            };
        }

        const formattedBook = {
            googleId: id, // Keeping name for compatibility
            title: data.title,
            authors: authors,
            description: description,
            categories: data.subjects ? data.subjects.slice(0, 5) : [],
            publishedDate: data.first_publish_date || 'Unknown',
            pageCount: null, // Often missing in Work, found in Edition
            imageLinks: imageLinks
        };

        res.json(formattedBook);
    } catch (error) {
        console.error('Open Library Detail Error:', error.message);
        res.status(404).json({ message: 'Book not found in Open Library' });
    }
};

module.exports = { searchGoogleBooks: searchRemoteBooks, getGoogleBookDetails: getRemoteBookDetails };
