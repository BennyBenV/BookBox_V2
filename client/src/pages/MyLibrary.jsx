import { useState } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import { FaBookOpen } from 'react-icons/fa';

const MyLibrary = () => {
    const { books, deleteBook, updateBook } = useBooks();
    const [filter, setFilter] = useState('ALL');

    const filteredBooks = books.filter(book => {
        if (filter === 'ALL') return true;
        return book.readingStatus === filter;
    });

    const handleStatusUpdate = (id, newStatus) => {
        updateBook(id, { readingStatus: newStatus });
    };

    const statusLabels = {
        'ALL': 'Tous',
        'TO_READ': 'À lire',
        'READING': 'En lecture',
        'COMPLETED': 'Terminé'
    };

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7]">Ma Bibliothèque</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez votre collection personnelle</p>
                </div>

                {/* Filters - Mobile Optimized */}
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x">
                    {['ALL', 'TO_READ', 'READING', 'COMPLETED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm snap-start flex-shrink-0 ${filter === status
                                ? 'bg-[#D67456] text-white shadow-md transform -translate-y-0.5'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }`}
                        >
                            {statusLabels[status]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Books Grid - Responsive for Mobile/Tablet */}
            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-20">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDelete={deleteBook}
                            onUpdateStatus={handleStatusUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-orange-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-[#D67456]">
                        <FaBookOpen className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Aucun livre trouvé</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        {filter === 'ALL'
                            ? "Votre bibliothèque est vide pour le moment."
                            : `Vous n'avez aucun livre dans la catégorie "${statusLabels[filter]}".`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyLibrary;
