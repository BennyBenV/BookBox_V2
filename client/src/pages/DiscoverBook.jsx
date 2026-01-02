import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { FaArrowLeft, FaBookOpen, FaCalendarAlt, FaLayerGroup, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DiscoverBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getGoogleBookDetails, addBook } = useBooks();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            const data = await getGoogleBookDetails(id);
            if (data) {
                setBook(data);
            } else {
                toast.error("Livre introuvable");
                navigate('/');
            }
            setLoading(false);
        };
        fetchBook();
    }, [id, getGoogleBookDetails, navigate]);

    const handleAddBook = async () => {
        // Construct standard book object from google data
        const newBook = {
            googleId: book.googleId,
            title: book.title,
            authors: book.authors,
            description: book.description,
            categories: book.categories,
            publishedDate: book.publishedDate,
            pageCount: book.pageCount,
            imageLinks: book.imageLinks,
            readingStatus: 'TO_READ' // Default status
        };

        try {
            await addBook(newBook);
            navigate('/'); // Go to dashboard (or maybe local book details?)
            // If we want to go to local book details, we need the new ID.
            // addBook returns data.
            // But let's stick to Dashboard to see it added.
        } catch (error) {
            // Error handled in context
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67456]"></div>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
            {/* Backdrop / Header Area */}
            <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30 blur-xl scale-110">
                    {book.imageLinks?.large || book.imageLinks?.thumbnail ? (
                        <img src={book.imageLinks?.large || book.imageLinks?.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-transparent to-transparent"></div>

                <div className="absolute top-6 left-4 md:left-8 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md transition-all font-medium border border-white/10"
                    >
                        <FaArrowLeft /> Retour
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cover Image (Left Column) */}
                    <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0 shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-slate-800 ring-4 ring-white dark:ring-slate-800">
                        {book.imageLinks?.thumbnail ? (
                            <img src={book.imageLinks.thumbnail} alt={book.title} className="w-full h-auto object-cover" />
                        ) : (
                            <div className="w-full aspect-[2/3] flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-400">
                                <FaBookOpen className="text-5xl mb-2" />
                                <span>Pas de couverture</span>
                            </div>
                        )}
                    </div>

                    {/* Content (Right Column) */}
                    <div className="flex-grow pt-4 md:pt-16">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2 drop-shadow-sm">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                                    {book.authors?.join(', ')}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 py-6 border-y border-slate-200 dark:border-slate-700 my-6">
                            <button
                                onClick={handleAddBook}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 bg-[#D67456] text-white hover:bg-[#C96746]"
                            >
                                <FaPlus /> Ajouter à ma bibliothèque
                            </button>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-slate-600 dark:text-slate-400 mb-8">
                            {book.publishedDate && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#FAF7F5] text-[#D67456] dark:bg-[#3E352E] dark:text-[#D67456] rounded-lg">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">Publié</p>
                                        <p>{book.publishedDate}</p>
                                    </div>
                                </div>
                            )}
                            {book.pageCount > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-slate-300 rounded-lg">
                                        <FaLayerGroup />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-slate-100">Pages</p>
                                        <p>{book.pageCount}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                <FaLayerGroup className="text-[#D67456] dark:text-[#D67456]" /> Résumé
                            </h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                {book.description ? (
                                    <p dangerouslySetInnerHTML={{ __html: book.description }}></p>
                                ) : (
                                    <p className="italic text-slate-400">Pas de résumé disponible.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverBook;
