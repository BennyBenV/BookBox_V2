import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { FaSearch, FaArrowLeft, FaArrowRight, FaBookOpen, FaPlus } from 'react-icons/fa';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { searchGoogleBooks, addBook } = useBooks();

    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const maxResults = 40; // Max allowed by Google Books API per request

    const [books, setBooks] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!q) return;
            setLoading(true);

            const startIndex = (page - 1) * maxResults;
            // Pass maxResults correctly now
            const data = await searchGoogleBooks(q, startIndex, maxResults, true);

            if (data) {
                const items = data.items || (Array.isArray(data) ? data : []);
                setBooks(items);
                setTotalItems(data.totalItems || 0);
            }
            setLoading(false);
            window.scrollTo(0, 0); // Scroll to top on new page
        };
        fetchBooks();
    }, [q, page, searchGoogleBooks]);

    // Google Books API is sometimes fuzzy with totals, limiting practical access to ~1000 items
    // But we'll try to show accurate pagination.
    const totalPages = Math.ceil((totalItems || 0) / maxResults);

    const handlePageChange = (newPage) => {
        if (newPage >= 1) {
            setSearchParams({ q, page: newPage });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate flex-grow">
                        Résultats pour "{q}"
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {books.length > 0 && (
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Page {page} • Environ {totalItems} résultats
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-[#D67456] border-t-transparent rounded-full mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Chargement...</p>
                    </div>
                ) : books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in">
                            {books.map((book) => (
                                <div key={book.googleId} className="flex bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 group relative">
                                    <div
                                        onClick={() => navigate(`/book/${book.googleId}`)}
                                        className="cursor-pointer flex-shrink-0 w-24 h-36 md:w-32 md:h-48 bg-slate-200 dark:bg-slate-700 mr-4 md:mr-6 overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all"
                                    >
                                        {book.imageLinks?.thumbnail ? (
                                            <img src={book.imageLinks.thumbnail} alt={book.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400"><span className="text-xs">Pas d'image</span></div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between flex-grow py-1 md:py-2">
                                        <div onClick={() => navigate(`/book/${book.googleId}`)} className="cursor-pointer">
                                            <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight mb-1 md:mb-2 group-hover:text-[#D67456] transition-colors">{book.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-1 text-sm md:text-base">{book.authors?.join(', ')}</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm">{book.publishedDate?.substring(0, 4)}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addBook({
                                                    googleId: book.googleId,
                                                    title: book.title,
                                                    authors: book.authors,
                                                    description: book.description,
                                                    categories: book.categories,
                                                    publishedDate: book.publishedDate,
                                                    pageCount: book.pageCount,
                                                    imageLinks: book.imageLinks,
                                                    readingStatus: 'TO_READ'
                                                });
                                            }}
                                            className="mt-2 md:mt-4 flex items-center justify-center w-full py-2 md:py-3 rounded-xl bg-orange-50 dark:bg-slate-700 text-[#D67456] dark:text-[#D67456] hover:bg-[#D67456] hover:text-white dark:hover:bg-[#D67456] dark:hover:text-white transition-all font-bold shadow-sm text-sm md:text-base"
                                        >
                                            <FaPlus className="mr-2" /> Ajouter
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-6 mt-12 mb-8">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-bold"
                            >
                                <FaArrowLeft /> Précédent
                            </button>

                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                Page {page}
                            </span>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                // Simplified logic: disable only if loading. 
                                // We trust user to stop if they see empty page or if we implement hasMore check based on books.length
                                disabled={loading || books.length === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-bold"
                            >
                                Suivant <FaArrowRight />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <FaBookOpen className="mx-auto text-6xl text-slate-200 dark:text-slate-700 mb-6" />
                        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Aucun résultat trouvé</h2>
                        <p className="text-slate-500 dark:text-slate-500">Essayez avec d'autres mots-clés.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
