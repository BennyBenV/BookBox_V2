import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { FaArrowLeft, FaBookOpen, FaBookReader, FaCheckCircle, FaCalendarAlt, FaPenNib, FaLayerGroup, FaSave, FaPlus } from 'react-icons/fa';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBook, updateBook, deleteBook, getGoogleBookDetails, addBook, getCommunityData, books } = useBooks(); // Added books
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLocal, setIsLocal] = useState(false); // Track if book is in library
    const [communityData, setCommunityData] = useState(null);

    // Review State
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isEditingReview, setIsEditingReview] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);

            let data = null;
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

            // 1. Try to fetch from Local Library ONLY if it looks like a MongoID
            if (isMongoId) {
                data = await getBook(id, true);
            }

            if (data) {
                setBook(data);
                setIsLocal(true);
                setReview(data.personalReview || '');
                setRating(data.rating || 0);
                // Fetch Community Data using Google ID
                if (data.googleId) {
                    const commData = await getCommunityData(data.googleId);
                    setCommunityData(commData);
                }
            } else {
                // 2. If not found, try Google Books (Preview Mode) or check if already in library

                // FIRST: Check if we already have this book in our local library (by Google ID)
                const existingLocalBook = books.find(b => b.googleId === id);

                if (existingLocalBook) {
                    setBook(existingLocalBook);
                    setIsLocal(true);
                    setReview(existingLocalBook.personalReview || '');
                    setRating(existingLocalBook.rating || 0);
                    // Fetch Community Data
                    const commData = await getCommunityData(id);
                    setCommunityData(commData);
                } else {
                    // Not in library, fetch from Google
                    data = await getGoogleBookDetails(id);
                    if (data) {
                        setBook(data);
                        setIsLocal(false);
                        // Fetch Community Data using Google ID
                        const commData = await getCommunityData(id);
                        setCommunityData(commData);
                    } else {
                        toast.error("Livre introuvable");
                        navigate('/');
                    }
                }
            }
            setLoading(false);
        };
        if (books) { // Only run if books are loaded (or empty array)
            fetchBook();
        }
    }, [id, getBook, getGoogleBookDetails, navigate, getCommunityData, books]);

    const handleStatusUpdate = async (newStatus) => {
        await updateBook(book._id, { readingStatus: newStatus });
        setBook({ ...book, readingStatus: newStatus });
    };

    const handleReviewSave = async () => {
        try {
            await updateBook(book._id, { personalReview: review, rating: rating });
            setBook({ ...book, personalReview: review, rating: rating });
            setIsEditingReview(false);
            toast.success('Avis enregistré !');
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre de votre bibliothèque ?")) {
            await deleteBook(book._id);
            navigate('/');
        }
    };

    const handleAddToLibrary = async () => {
        const newBook = {
            googleId: book.googleId,
            title: book.title,
            authors: book.authors,
            description: book.description,
            categories: book.categories,
            publishedDate: book.publishedDate,
            pageCount: book.pageCount,
            imageLinks: book.imageLinks,
            readingStatus: 'TO_READ'
        };

        try {
            const addedBook = await addBook(newBook);
            // Navigate to the new local book URL to ensure state is correctly switched
            navigate(`/book/${addedBook._id}`, { replace: true });

            setIsLocal(true);
            setBook(addedBook);
            setReview('');
            setRating(0);
            toast.success("Ajouté à votre bibliothèque !");
        } catch (error) {
            // Error managed in context
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

    // Helper for status colors
    const statusColors = {
        TO_READ: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
        READING: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
        COMPLETED: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
    };

    const statusDisplay = {
        TO_READ: 'À lire',
        READING: 'En lecture',
        COMPLETED: 'Terminé',
    };

    const backdropImage = book.imageLinks?.large || book.imageLinks?.thumbnail;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
            {/* Backdrop / Header Area */}
            <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30 blur-xl scale-110">
                    {backdropImage && (
                        <img
                            src={backdropImage}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
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
                            <img
                                src={book.imageLinks.thumbnail}
                                alt={book.title}
                                className="w-full h-auto object-cover"
                            />
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

                            {/* Status Badge (Only for Local Books) */}
                            {isLocal && book.readingStatus && (
                                <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-black/5 dark:border-white/5 ${statusColors[book.readingStatus]}`}>
                                    {statusDisplay[book.readingStatus]}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {isLocal ? (
                            <div className="flex flex-wrap gap-4 py-6 border-y border-slate-200 dark:border-slate-700 my-6">
                                <button
                                    onClick={() => handleStatusUpdate('TO_READ')}
                                    disabled={book.readingStatus === 'TO_READ'}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all transform hover:-translate-y-0.5 ${book.readingStatus === 'TO_READ'
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-default shadow-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                        }`}
                                >
                                    <FaBookOpen /> À lire
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('READING')}
                                    disabled={book.readingStatus === 'READING'}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all transform hover:-translate-y-0.5 ${book.readingStatus === 'READING'
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 cursor-default shadow-none'
                                        : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 border border-amber-200 dark:border-amber-900/30'
                                        }`}
                                >
                                    <FaBookReader /> En lecture
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('COMPLETED')}
                                    disabled={book.readingStatus === 'COMPLETED'}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all transform hover:-translate-y-0.5 ${book.readingStatus === 'COMPLETED'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 cursor-default shadow-none'
                                        : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-emerald-900/30'
                                        }`}
                                >
                                    <FaCheckCircle /> Terminé
                                </button>

                                <div className="flex-grow"></div>

                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        ) : (
                            // Add To Library Button (For Google Books)
                            <div className="flex flex-wrap gap-4 py-6 border-y border-slate-200 dark:border-slate-700 my-6">
                                <button
                                    onClick={handleAddToLibrary}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 bg-[#D67456] text-white hover:bg-[#C96746]"
                                >
                                    <FaPlus /> Ajouter à ma bibliothèque
                                </button>
                            </div>
                        )}

                        {/* Review & Rating Section (Only for Local Books) */}
                        {isLocal && (
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                        <FaPenNib className="text-[#D67456]" /> Mon Avis
                                    </h3>
                                    {!isEditingReview ? (
                                        <button
                                            onClick={() => setIsEditingReview(true)}
                                            className="text-sm text-[#D67456] font-bold hover:underline"
                                        >
                                            Modifier
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleReviewSave}
                                            className="flex items-center gap-2 bg-[#D67456] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#C96746] transition"
                                        >
                                            <FaSave /> Enregistrer
                                        </button>
                                    )}
                                </div>

                                {isEditingReview ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Note :</span>
                                            <StarRating rating={rating} onRatingChange={setRating} />
                                        </div>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#D67456] focus:border-[#D67456] transition-shadow bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                                            placeholder="Partagez votre avis sur ce livre..."
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        {rating > 0 && (
                                            <div className="mb-3">
                                                <StarRating rating={rating} readOnly={true} />
                                            </div>
                                        )}
                                        {review ? (
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-[#D67456]/30 pl-4 py-1 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg">
                                                "{review}"
                                            </p>
                                        ) : (
                                            <p className="text-slate-400 dark:text-slate-500 text-sm italic">Pas encore d'avis. Cliquez sur modifier pour en ajouter un.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

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

                {/* COMMUNITY SECTION */}
                <div className="mt-16 animate-fade-in-up max-w-4xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <FaBookReader className="text-[#D67456] dark:text-[#D67456]" /> Avis de la Communauté
                    </h3>

                    {/* Community Stats (Average) */}
                    {communityData && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 flex items-center gap-8">
                            <div className="text-center border-r border-slate-100 dark:border-slate-700 pr-8">
                                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">{communityData.averageRating}</div>
                                <div className="flex justify-center mb-1">
                                    <StarRating rating={Math.round(communityData.averageRating)} readOnly={true} />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold">{communityData.ratingCount} Notes</p>
                            </div>
                            <div className="flex-grow">
                                <p className="text-slate-600 dark:text-slate-300 italic">
                                    "Découvrez ce que les autres pensent de ce livre..."
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {communityData?.reviews?.length > 0 ? (
                            communityData.reviews.map((review) => (
                                <div key={review._id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#D67456] flex items-center justify-center text-white font-bold text-sm shadow-sm font-serif">
                                                {review.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">{review.username}</span>
                                                <span className="block text-xs text-slate-400">
                                                    {new Date(review.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        {review.rating > 0 && <StarRating rating={review.rating} readOnly={true} size="sm" />}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">Pas encore d'avis de la communauté. Soyez le premier !</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
