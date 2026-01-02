import { useEffect, useState } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaUserFriends } from 'react-icons/fa';
import FeedItem from '../components/FeedItem';
import CommentModal from '../components/CommentModal';

const Feed = () => {
    const { books, loading: booksLoading } = useBooks();
    const { user } = useAuth();
    const { getUserFeed } = useUsers();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            if (user) {
                setLoading(true);
                const friendsBooks = await getUserFeed();

                // Transform friends books into activities
                const feedActivities = friendsBooks.map(book => ({
                    type: book.readingStatus === 'COMPLETED' && book.dateCompleted ? 'COMPLETED' :
                        book.rating > 0 ? 'RATED' : 'ADDED',
                    date: new Date(book.dateAdded), // fallback to dateAdded if specific date missing
                    book: book,
                    user: book.user,
                    rating: book.rating,
                    review: book.personalReview
                }));

                setActivities(feedActivities);
                setLoading(false);
            }
        };
        fetchFeed();
    }, [user, getUserFeed]);

    const handleCommentClick = (activity) => {
        setSelectedBook(activity.book);
        setShowCommentModal(true);
    };

    if (loading || booksLoading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67456]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-4 flex items-center justify-center gap-3">
                        <FaUserFriends className="text-[#D67456]" />
                        Fil d'actualité
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Découvrez les lectures et avis de votre cercle littéraire.
                    </p>
                </div>

                <div className="space-y-6 md:space-y-8 relative">
                    {/* Vertical Line - Only visible on large desktop */}
                    <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 hidden lg:block"></div>

                    {activities.length > 0 ? (
                        activities.map((activity, index) => (
                            <FeedItem
                                key={index}
                                activity={activity}
                                onCommentClick={handleCommentClick}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 animate-fade-in-up">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                                <FaUserFriends size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">C'est un peu calme ici...</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                Suivez d'autres lecteurs pour voir leurs activités, leurs coups de cœur et leurs avis apparaître ici.
                            </p>
                            <Link to="/discover" className="inline-flex items-center gap-2 bg-[#D67456] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#C96746] transition-all transform hover:-translate-y-0.5">
                                <FaPlus /> Découvrir des lecteurs
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <CommentModal
                isOpen={showCommentModal}
                onClose={() => setShowCommentModal(false)}
                bookId={selectedBook?._id}
                bookTitle={selectedBook?.title}
            />
        </div>
    );
};

export default Feed;
