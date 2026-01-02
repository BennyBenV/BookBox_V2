import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import toast from 'react-hot-toast';

const BookContext = createContext();

export const useBooks = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // New state for search results
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch books when user is logged in
    useEffect(() => {
        if (user) {
            getBooks();
        } else {
            setBooks([]);
        }
    }, [user]);

    const getBooks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/books`, config);
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const addBook = async (bookData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${API_URL}/api/books`, bookData, config);
            setBooks([data, ...books]);
            toast.success('Book added successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding book');
            throw error;
        }
    };

    const deleteBook = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_URL}/api/books/${id}`, config);
            setBooks(books.filter((book) => book._id !== id));
            toast.success('Book removed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting book');
        }
    };

    const updateBook = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(`${API_URL}/api/books/${id}`, updatedData, config);
            setBooks(books.map((book) => (book._id === id ? data : book)));
            toast.success('Book updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating book');
        }
    };

    const getBook = async (id, silent = false) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/books/${id}`, config);
            return data;
        } catch (error) {
            // console.error(error); // Optional: keep log but remove toast
            if (!silent) toast.error('Error fetching book details');
            return null;
        }
    };

    const getGoogleBookDetails = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/search/${id}`, config);
            return data;
        } catch (error) {
            console.error(error);
            toast.error('Error fetching book details');
            return null;
        }
    };

    const getCommunityData = async (googleId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/books/community/${googleId}`, config);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getTrendingBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/books/trending`, config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const searchGoogleBooks = useCallback(async (query, startIndex = 0, maxResults = 40, silent = false, orderBy = 'relevance') => {
        try {
            if (!silent) setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // Ensure maxResults is a number (handle incorrect legacy calls passing boolean)
            const limit = typeof maxResults === 'number' ? maxResults : 40;
            const silentMode = typeof maxResults === 'boolean' ? maxResults : silent;

            const { data } = await axios.get(`${API_URL}/api/search?q=${query}&startIndex=${startIndex}&maxResults=${limit}&orderBy=${orderBy}`, config);

            // Handle both legacy (array) and new (object) backend responses for safety during migration
            const results = Array.isArray(data) ? data : (data.items || []);

            setSearchResults(results);
            if (!silent) setLoading(false);
            return data;
        } catch (error) {
            console.error(error);
            if (!silent) setLoading(false);
            toast.error('Search failed');
            return { items: [], totalItems: 0 };
        }
    }, []);

    const likeBook = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(`${API_URL}/api/books/${bookId}/like`, {}, config);
            return data;
        } catch (error) {
            console.error(error);
            toast.error('Could not like book');
            throw error;
        }
    };

    const getComments = async (bookId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/books/${bookId}/comments`, config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const addComment = async (bookId, content) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${API_URL}/api/books/${bookId}/comments`, { content }, config);
            toast.success('Comment added');
            return data;
        } catch (error) {
            console.error(error);
            toast.error('Could not add comment');
            throw error;
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${API_URL}/api/comments/${commentId}`, config);
            toast.success('Comment deleted');
        } catch (error) {
            console.error(error);
            toast.error('Could not delete comment');
        }
    };

    return (
        <BookContext.Provider value={{
            books,
            searchResults,
            loading,
            getBooks,
            getBook,
            getGoogleBookDetails,
            getCommunityData,
            getTrendingBooks,
            addBook,
            deleteBook,
            updateBook,
            searchGoogleBooks,
            likeBook,
            getComments,
            addComment,
            deleteComment
        }}>
            {children}
        </BookContext.Provider>
    );
};
