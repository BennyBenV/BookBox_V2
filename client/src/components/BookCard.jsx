import { FaTrash, FaBookReader, FaCheckCircle, FaBookOpen, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onDelete, onUpdateStatus }) => {
    const statusConfig = {
        TO_READ: {
            color: 'bg-slate-100 text-slate-600 border-slate-200',
            label: 'To Read',
            icon: <FaBookOpen />
        },
        READING: {
            color: 'bg-amber-50 text-amber-700 border-amber-200',
            label: 'Reading',
            icon: <FaBookReader />
        },
        COMPLETED: {
            color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            label: 'Finished',
            icon: <FaCheckCircle />
        },
    };

    const currentStatus = statusConfig[book.readingStatus] || statusConfig['TO_READ'];

    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-700">
            {/* Cover Image Area */}
            <div className="relative aspect-[2/3] bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <Link to={`/book/${book._id}`} className="block w-full h-full cursor-pointer">
                    {book.imageLinks?.thumbnail ? (
                        <img
                            src={book.imageLinks.thumbnail}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                            <FaBookOpen className="text-3xl mb-2 opacity-50" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">No Cover</span>
                        </div>
                    )}
                </Link>

                {/* Status Badge (Overlay - Minimal) */}
                <div className="absolute top-2 right-2 opacity-90 z-10">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border shadow-sm backdrop-blur-md bg-white/90 ${currentStatus.color.replace('bg-', 'text-')}`} title={currentStatus.label}>
                        {currentStatus.icon}
                    </span>
                </div>

                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px] z-20">
                    <div className="flex gap-2">
                        {book.readingStatus !== 'TO_READ' && (
                            <button
                                onClick={() => onUpdateStatus(book._id, 'TO_READ')}
                                className="p-3 rounded-full bg-white text-slate-600 hover:bg-slate-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
                                title="À lire"
                            >
                                <FaBookOpen />
                            </button>
                        )}
                        {book.readingStatus !== 'READING' && (
                            <button
                                onClick={() => onUpdateStatus(book._id, 'READING')}
                                className="p-3 rounded-full bg-white text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
                                title="En lecture"
                            >
                                <FaBookReader />
                            </button>
                        )}
                        {book.readingStatus !== 'COMPLETED' && (
                            <button
                                onClick={() => onUpdateStatus(book._id, 'COMPLETED')}
                                className="p-3 rounded-full bg-white text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
                                title="Terminé"
                            >
                                <FaCheckCircle />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => onDelete(book._id)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-red-500 hover:text-white transition-all text-sm mt-2"
                        title="Supprimer"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            {/* Micro-Content Area */}
            <div className="p-4">
                <Link to={`/book/${book._id}`} className="hover:text-[#D67456] dark:hover:text-[#D67456] transition-colors">
                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 leading-tight mb-1 truncate" title={book.title}>
                        {book.title}
                    </h3>
                </Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                    {book.authors?.join(', ') || 'Inconnu'}
                </p>
                {book.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                        <FaStar className="text-amber-400 text-xs" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{book.rating}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
