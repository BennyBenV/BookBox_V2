import { useState } from 'react';
import { useBooks } from '../context/BookContext';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBooks = () => {
    const [query, setQuery] = useState('');
    const { searchGoogleBooks, searchResults, loading, addBook } = useBooks();
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            await searchGoogleBooks(query, 0, 40);
        }
    };

    const handleAddBook = async (googleBook) => {
        // Transform Google Book format to our Book Model format
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
        navigate('/'); // Redirect to dashboard after adding
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-4">
                    Rechercher des Livres
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Trouvez votre prochaine lecture parmi des millions de livres
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
                <div className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Titre, auteur, ou ISBN..."
                        className="w-full pl-14 pr-4 py-4 rounded-2xl border-0 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-700 shadow-xl text-lg font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all placeholder:text-slate-400"
                    />
                    <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl group-hover:text-[#D67456] transition-colors" />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-3 top-3 bottom-3 bg-[#D67456] text-white px-6 rounded-xl hover:bg-[#C96746] transition-all font-bold shadow-md hover:shadow-lg disabled:bg-slate-300 dark:disabled:bg-slate-700 transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </div>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {searchResults.map((book) => (
                    <div key={book.googleId} className="flex bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 group">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-32 h-48 bg-slate-200 dark:bg-slate-700 mr-6 overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all">
                            {book.imageLinks?.thumbnail ? (
                                <img
                                    src={book.imageLinks.thumbnail}
                                    alt={book.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <span className="text-xs">Pas de couverture</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between flex-grow py-2">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight mb-2 group-hover:text-[#D67456] transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">{book.authors?.join(', ')}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-sm">{book.publishedDate?.substring(0, 4)}</p>
                            </div>

                            <button
                                onClick={() => handleAddBook(book)}
                                className="mt-4 flex items-center justify-center w-full py-3 rounded-xl bg-orange-50 dark:bg-slate-700 text-[#D67456] dark:text-[#D67456] hover:bg-[#D67456] hover:text-white dark:hover:bg-[#D67456] dark:hover:text-white transition-all font-bold shadow-sm"
                            >
                                <FaPlus className="mr-2" /> Ajouter
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && searchResults.length === 0 && query && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 mt-10">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Aucun résultat pour "{query}"</p>
                    <p className="text-slate-400 text-sm mt-2">Essayez avec d'autres mots-clés</p>
                </div>
            )}
        </div>
    );
};

export default SearchBooks;
