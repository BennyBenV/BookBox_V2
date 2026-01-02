import { useState, useEffect } from 'react';
import { useUsers } from '../context/UserContext';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaCheck, FaUsers, FaBook, FaPlus, FaBookOpen } from 'react-icons/fa';

const Discover = () => {
    const { searchUsers, searchedUsers, followUser, unfollowUser, getUserProfile } = useUsers();
    const { searchGoogleBooks, searchResults, loading: booksLoading, addBook } = useBooks(); // Use book context
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Tabs: 'books' or 'users'
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'books');

    // Unified Search Query
    const [query, setQuery] = useState('');
    const [followingIds, setFollowingIds] = useState([]);

    // Pagination State
    const [allBooks, setAllBooks] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Update URL when tab changes
    useEffect(() => {
        setSearchParams({ tab: activeTab });
        // Don't clear query if it comes from URL
        if (!searchParams.get('q')) {
            // setQuery(''); // Keep query persistence if desired
        }
    }, [activeTab, setSearchParams, searchParams]);

    // Initialize query from URL
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
        }
    }, [searchParams]);

    // Fetch user profile for following list
    useEffect(() => {
        const fetchCurrentUserProfile = async () => {
            const userId = user?.id || user?._id;
            if (userId) {
                const profile = await getUserProfile(userId);
                if (profile) {
                    setFollowingIds(profile.following.map(u => u._id || u));
                }
            }
        };
        fetchCurrentUserProfile();
    }, [user, getUserProfile]);

    // Search Logic (Debounced)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                if (activeTab === 'users') {
                    searchUsers(query);
                } else {
                    // Reset pagination for new query
                    // Only fetch if we are redefining the list (startIndex 0)
                    // We handle pagination separately
                    const data = await searchGoogleBooks(query, 0, 40);
                    if (data) {
                        // Support both new object response and legacy array
                        const items = data.items || (Array.isArray(data) ? data : []);
                        const total = data.totalItems || 0;
                        setAllBooks(items);
                        setTotalItems(total);
                        setHasMore(items.length < total);
                        setStartIndex(0);
                    }
                }
            } else {
                setShowDropdown(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query, activeTab, searchUsers, searchGoogleBooks]);

    // Show dropdown when results arrive
    useEffect(() => {
        if (searchResults.length > 0 && query.length >= 2) {
            setShowDropdown(true);
        }
    }, [searchResults, query]);

    const handleLoadMore = async () => {
        const nextIndex = startIndex + 40; // Use 40 here too
        setStartIndex(nextIndex);
        const data = await searchGoogleBooks(query, nextIndex, 40, true); // Silent load

        if (data) {
            const newItems = data.items || (Array.isArray(data) ? data : []);
            setAllBooks(prev => [...prev, ...newItems]);
            setHasMore(allBooks.length + newItems.length < (data.totalItems || totalItems));
        }
    };

    // User Actions
    const handleFollow = async (userId) => {
        await followUser(userId);
        setFollowingIds([...followingIds, userId]);
    };

    const handleUnfollow = async (userId) => {
        await unfollowUser(userId);
        setFollowingIds(followingIds.filter(id => id !== userId));
    };

    const isFollowing = (userId) => followingIds.includes(userId);

    // Book Actions
    const handleAddBook = async (googleBook) => {
        const newBook = {
            googleId: googleBook.googleId,
            title: googleBook.title,
            authors: googleBook.authors,
            description: googleBook.description,
            categories: googleBook.categories,
            publishedDate: googleBook.publishedDate,
            pageCount: googleBook.pageCount,
            imageLinks: googleBook.imageLinks,
            readingStatus: 'TO_READ'
        };
        await addBook(newBook);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 md:mb-8 text-center animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-4 flex items-center justify-center gap-3">
                        <span className="bg-[#FAF7F5] dark:bg-[#3E352E] p-2 rounded-xl text-[#D67456]"><FaSearch /></span>
                        Recherche Globale
                    </h1>
                    <p className="text-[#8B7B6B] dark:text-[#C4B5A7] text-base md:text-lg">Trouvez votre prochaine lecture ou de nouveaux amis</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-6 md:mb-10 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex space-x-4 md:space-x-8">
                        <button
                            onClick={() => setActiveTab('books')}
                            className={`pb-4 px-4 text-lg font-bold transition-all relative ${activeTab === 'books'
                                ? 'text-[#D67456] border-b-2 border-[#D67456]'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center gap-2"><FaBookOpen /> Livres</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-4 px-4 text-lg font-bold transition-all relative ${activeTab === 'users'
                                ? 'text-[#D67456] border-b-2 border-[#D67456]'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                        >
                            <span className="flex items-center gap-2"><FaUsers /> Lecteurs</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8 max-w-2xl mx-auto z-20">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D67456] text-xl z-20" />
                    <input
                        type="text"
                        placeholder={activeTab === 'books' ? "Titre, auteur, ISBN..." : "Rechercher des lecteurs..."}
                        className="w-full pl-16 pr-6 py-4 rounded-2xl border-0 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-700 shadow-xl transition-all text-lg font-medium"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        autoFocus
                    />

                    {/* Autocomplete Dropdown - Only for Books */}
                    {showDropdown && query.length >= 2 && activeTab === 'books' && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] border border-slate-100 dark:border-slate-700 max-h-96 overflow-y-auto animate-fade-in flex flex-col">
                            {searchResults.slice(0, 5).map((book) => (
                                <div
                                    key={book.googleId}
                                    onClick={() => navigate(`/book/${book.googleId}`)}
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
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent blur before click
                                    navigate(`/results?q=${encodeURIComponent(query)}`);
                                }}
                                className="p-3 text-center bg-slate-50 dark:bg-slate-700/50 text-[#D67456] font-bold text-sm cursor-pointer hover:underline border-t border-slate-100 dark:border-slate-700"
                            >
                                Voir tous les résultats pour "{query}"
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {/* BOOKS TAB CONTENT */}
                    {/* BOOKS TAB CONTENT */}
                    {activeTab === 'books' && (
                        <div className="animate-fade-in">
                            {/* Grid removed to avoid duplication with Dropdown/Results Page */}
                            <div className="text-center py-20">
                                <FaBookOpen className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
                                <p className="text-slate-400">Utilisez la barre de recherche pour trouver des livres</p>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB CONTENT */}
                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            {query.length >= 2 ? (
                                searchedUsers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {searchedUsers.map((foundUser) => (
                                            <div key={foundUser._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-all group">
                                                <div onClick={() => navigate(`/user/${foundUser._id}`)} className="flex items-center gap-4 cursor-pointer flex-grow">
                                                    <div className="w-16 h-16 rounded-full bg-[#D67456] flex items-center justify-center text-white font-bold text-2xl shadow-md font-serif group-hover:scale-105 transition-transform">
                                                        {foundUser.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xl group-hover:text-[#D67456] transition-colors">{foundUser.username}</h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Membre depuis {new Date(foundUser.createdAt).getFullYear()}</p>
                                                    </div>
                                                </div>
                                                {isFollowing(foundUser._id) ? (
                                                    <button onClick={() => handleUnfollow(foundUser._id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-bold text-sm">
                                                        <FaCheck /> Abonné
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleFollow(foundUser._id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D67456] hover:bg-[#C96746] text-white transition-colors font-bold text-sm shadow-sm">
                                                        <FaUserPlus /> Suivre
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-slate-400"><p>Aucun lecteur trouvé pour "{query}"</p></div>
                                )
                            ) : (
                                <div className="text-center py-20">
                                    <FaUsers className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-4" />
                                    <p className="text-slate-400">Recherchez des amis pour suivre leur activité</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
