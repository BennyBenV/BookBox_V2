import { useState, useEffect } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { FaSearch, FaBookReader, FaBookOpen, FaArrowRight, FaTimes, FaStar, FaChartLine } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendationRow = ({ books, searchGoogleBooks }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (books.length === 0) {
                // Default to a popular genre if no books
                try {
                    // q, startIndex, maxResults, silent, orderBy
                    const data = await searchGoogleBooks('subject:fiction', 0, 4, true, 'newest');
                    setRecommendations(data.items || []);
                } catch (err) {
                    console.error("Error fetching defaults", err);
                }
                setLoading(false);
                return;
            }

            // Simple recommendation logic: Find most frequent category
            const categories = {};
            books.forEach(book => {
                if (book.categories) {
                    book.categories.forEach(cat => {
                        categories[cat] = (categories[cat] || 0) + 1;
                    });
                }
            });

            const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, 'Fiction');

            try {
                // Fetch from Google Books based on top category
                const data = await searchGoogleBooks(`subject:${topCategory}`, 0, 4, true, 'relevance');

                // Filter out books already in library (by googleId if possible, or rough title match)
                const libraryIds = books.map(b => b.googleId);
                const filtered = data.items?.filter(item => !libraryIds.includes(item.id)) || [];
                setRecommendations(filtered);
            } catch (error) {
                console.error("Error fetching recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [books, searchGoogleBooks]);

    if (loading) return <div className="h-48 flex items-center justify-center text-slate-500 italic">Recherche de pépites...</div>;

    if (recommendations.length === 0) return null;

    return (
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-0 scrollbar-hide snap-x">
            {recommendations.map(item => (
                <div key={item.googleId} className="min-w-[160px] md:min-w-0 snap-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden group">
                        {item.imageLinks?.thumbnail ? (
                            <img src={item.imageLinks.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><FaBookOpen size={32} /></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Link to={`/book/${item.googleId}`} className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                Voir Détails
                            </Link>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1 font-serif">{item.title}</h4>
                        <p className="text-xs text-slate-500 mb-2 line-clamp-1">{item.authors?.join(', ')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Dashboard = () => {
    const { books, loading, deleteBook, updateBook, searchGoogleBooks, addBook, searchResults, getTrendingBooks } = useBooks();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            const data = await getTrendingBooks();
            setTrending(data);
        };
        fetchTrending();
    }, [getTrendingBooks]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 2) {
                searchGoogleBooks(searchQuery, 0, 40, true);
            } else {
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, searchGoogleBooks]);

    useEffect(() => {
        if (searchResults.length > 0 && searchQuery.length >= 2) {
            setShowDropdown(true);
        }
    }, [searchResults, searchQuery]);

    const handleStatusUpdate = (id, newStatus) => {
        updateBook(id, { readingStatus: newStatus });
    };

    const handleSearch = async (e) => {
        e && e.preventDefault();
        setShowDropdown(false);
        if (searchQuery.trim()) {
            setIsSearching(true);
            await searchGoogleBooks(searchQuery, 0, 40);
            setShowResults(true);
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
        setShowDropdown(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-[#EBE5E0] dark:bg-slate-800 py-10 md:py-16 border-b border-slate-200 dark:border-slate-700 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-10">
                        <h1 className="text-3xl md:text-6xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-4 md:mb-6">
                            Votre univers littéraire
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Explorez, organisez et enrichissez votre bibliothèque personnelle en toute simplicité.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto relative cursor-text">
                        <form onSubmit={handleSearch} className="relative group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl z-20 group-hover:text-[#D67456] transition-colors" />
                            <input
                                type="text"
                                placeholder="Rechercher un livre par titre, auteur, ISBN..."
                                className="w-full pl-16 pr-14 py-3 md:py-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-base md:text-lg placeholder-slate-400 transition-all font-medium focus:ring-4 focus:ring-[#D67456]/20 focus:border-[#D67456]"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (!e.target.value.trim()) {
                                        setShowResults(false);
                                        setShowDropdown(false);
                                    }
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </form>

                        {/* Autocomplete Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] border border-slate-100 dark:border-slate-700 max-h-96 overflow-y-auto animate-fade-in">
                                {searchResults.slice(0, 5).map((book) => (
                                    <div
                                        key={book.googleId}
                                        onClick={() => {
                                            navigate(`/book/${book.googleId}`);
                                            clearSearch();
                                        }}
                                        className="flex items-center gap-4 p-4 hover:bg-orange-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-50 dark:border-slate-700 last:border-0 transition-colors group"
                                    >
                                        <div className="w-12 h-16 bg-slate-200 dark:bg-slate-700 rounded shadow-sm overflow-hidden flex-shrink-0">
                                            {book.imageLinks?.thumbnail ? (
                                                <img
                                                    src={book.imageLinks.thumbnail}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                    <FaBookOpen />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left flex-grow">
                                            <h4 className="font-bold text-[#3E3026] dark:text-[#F5EFE7] group-hover:text-[#D67456] dark:group-hover:text-[#D67456] transition-colors line-clamp-1 text-base md:text-lg font-serif">{book.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{book.authors?.join(', ')}</p>
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={() => {
                                        navigate(`/results?q=${encodeURIComponent(searchQuery)}`);
                                        clearSearch();
                                    }}
                                    className="p-3 text-center bg-slate-50 dark:bg-slate-700/50 text-[#D67456] font-bold text-sm cursor-pointer hover:underline border-t border-slate-100 dark:border-slate-700"
                                >
                                    Voir tous les résultats pour "{searchQuery}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
                {/* Recent Adds Section */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                <span className="bg-[#FAF7F5] dark:bg-[#3E352E] p-2 rounded-lg text-[#D67456] dark:text-[#D67456]"><FaBookOpen /></span>
                                Ajouts Récents
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">{books.length} livres dans votre collection</p>
                        </div>
                        <Link to="/library" className="group flex items-center gap-2 text-[#D67456] dark:text-[#D67456] font-bold hover:text-[#C96746] dark:hover:text-[#C96746] transition-colors text-sm md:text-base">
                            Voir Tout <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {books.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:pb-0 scrollbar-hide snap-x">
                            {books.slice(0, 5).map((book) => (
                                <div key={book._id} className="min-w-[160px] md:min-w-0 snap-center">
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <FaBookOpen className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">Votre bibliothèque est vide</h3>
                            <p className="text-slate-400 dark:text-slate-500 mb-6">Commencez par rechercher des livres ci-dessus</p>
                        </div>
                    )}
                </div>

                {/* Trending Section */}
                {trending.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                    <span className="bg-[#FAF7F5] dark:bg-[#3E352E] p-2 rounded-lg text-[#D67456] dark:text-[#D67456]"><FaChartLine /></span>
                                    Tendances
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Les livres les plus populaires de la communauté</p>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:pb-0 scrollbar-hide snap-x">
                            {trending.map((book) => (
                                <div
                                    key={book._id}
                                    onClick={() => navigate(`/book/${book._id}`)}
                                    className="group cursor-pointer min-w-[150px] md:min-w-0 snap-center"
                                    title={book.title}
                                >
                                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg mb-3 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:ring-[#D67456] dark:group-hover:ring-[#D67456] transition-all">
                                        <img
                                            src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196'}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                            <span>★</span> {book.averageRating ? book.averageRating.toFixed(1) : '-'}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1 truncate group-hover:text-[#D67456] transition-colors font-serif">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{book.authors?.join(', ')}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{book.count} lecteurs</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations Section */}
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6 flex items-center gap-3">
                        <span className="bg-[#FAF7F5] dark:bg-[#3E352E] p-2 rounded-lg text-[#D67456] dark:text-[#D67456]"><FaStar /></span>
                        Recommandé pour vous
                    </h2>
                    <RecommendationRow books={books} searchGoogleBooks={searchGoogleBooks} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
