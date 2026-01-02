import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaCheckCircle, FaStar, FaPlus, FaQuoteLeft, FaHeart, FaRegHeart, FaComment, FaRegComment } from 'react-icons/fa'; // Added Heart icons
import { timeAgo } from '../utils/dateUtils';

const FeedItem = ({ activity, onCommentClick }) => {
    const { user } = useAuth();
    const { likeBook } = useBooks();

    // Initialize state from props
    // Note: activity.book is the populated book object. Ensure 'likes' is an array of IDs.
    const [likes, setLikes] = useState(activity.book.likes || []);
    const [isLiked, setIsLiked] = useState(activity.book.likes ? activity.book.likes.includes(user?.id) : false);
    const [animateHeart, setAnimateHeart] = useState(false);

    const handleLike = async () => {
        if (!user) return;

        // Optimistic update
        const previouslyLiked = isLiked;
        const previousLikes = [...likes];

        setIsLiked(!previouslyLiked);
        if (!previouslyLiked) {
            setLikes([...likes, user.id]);
            setAnimateHeart(true);
            setTimeout(() => setAnimateHeart(false), 300); // Reset animation
        } else {
            setLikes(likes.filter(id => id !== user.id));
        }

        try {
            const updatedLikes = await likeBook(activity.book._id);
            // Sync with server response to be sure
            setLikes(updatedLikes);
            setIsLiked(updatedLikes.includes(user.id));
        } catch (error) {
            // Revert on error
            setIsLiked(previouslyLiked);
            setLikes(previousLikes);
        }
    };

    return (
        <div className="relative flex flex-col lg:flex-row gap-4 md:gap-6 animate-fade-in group mb-8">
            {/* Icon Bubble - Only visible on Large Desktop */}
            <div className="hidden lg:flex flex-shrink-0 z-10 mt-1">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-slate-50 dark:border-slate-900 shadow-md transition-transform group-hover:scale-110 ${activity.type === 'ADDED' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    activity.type === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                    {activity.type === 'ADDED' && <FaPlus size={20} />}
                    {activity.type === 'COMPLETED' && <FaCheckCircle size={20} />}
                    {activity.type === 'RATED' && <FaStar size={20} />}
                </div>
            </div>

            {/* Content Card */}
            <div className={`flex-grow bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 
                border-l-4 lg:border-l-0 ${activity.type === 'ADDED' ? 'border-l-blue-400 dark:border-l-blue-500' :
                    activity.type === 'COMPLETED' ? 'border-l-emerald-400 dark:border-l-emerald-500' :
                        'border-l-amber-400 dark:border-l-amber-500'
                }`}>

                <div className="p-5 md:p-6 pb-2"> {/* Reduce bottom padding for actions */}
                    <div className="flex justify-between items-start mb-4 border-b border-slate-50 dark:border-slate-700/50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D67456] flex items-center justify-center text-white font-bold font-serif shadow-sm">
                                {activity.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 flex-wrap">
                                    <Link to={`/user/${activity.user._id}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#D67456] dark:hover:text-[#D67456] transition-colors">
                                        {activity.user?.username}
                                    </Link>
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                                        {activity.type === 'ADDED' && 'a ajouté un livre'}
                                        {activity.type === 'COMPLETED' && 'a fini de lire'}
                                        {activity.type === 'RATED' && 'a noté un livre'}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    {timeAgo(activity.date)}
                                </span>
                            </div>
                        </div>
                        {activity.type === 'RATED' && (
                            <div className="flex bg-amber-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                <FaStar className="text-amber-400 text-sm mr-1 mt-0.5" />
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{activity.rating}/5</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-5">
                        <Link to={`/book/${activity.book._id}`} className="flex-shrink-0 w-20 md:w-24 aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all relative">
                            {activity.book.imageLinks?.thumbnail ? (
                                <img src={activity.book.imageLinks.thumbnail} alt={activity.book.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <FaBook size={24} />
                                </div>
                            )}
                        </Link>

                        <div className="flex-grow min-w-0">
                            <Link to={`/book/${activity.book._id}`} className="font-serif font-bold text-lg text-[#3E3026] dark:text-[#F5EFE7] hover:text-[#D67456] dark:hover:text-[#D67456] transition-colors block mb-1 truncate">
                                {activity.book.title}
                            </Link>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 truncate">{activity.book.authors?.join(', ')}</p>

                            {activity.type === 'RATED' && activity.review && (
                                <div className="relative bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => onCommentClick(activity)}>
                                    <FaQuoteLeft className="absolute top-2 left-2 text-slate-200 dark:text-slate-600 text-xl -z-0" />
                                    <span className="relative z-10">"{activity.review}"</span>
                                </div>
                            )}

                            {activity.type !== 'RATED' && activity.book.description && (
                                <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-2">
                                    {activity.book.description.replace(/<[^>]*>?/gm, '')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Social Actions Bar */}
                <div className="px-6 py-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between gap-6">
                    <div className="flex gap-6">
                        <button
                            onClick={(e) => { e.preventDefault(); handleLike(); }}
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${isLiked ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500 hover:text-rose-400'}`}
                        >
                            <div className={`relative ${animateHeart ? 'animate-ping' : ''}`}>
                                {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                            </div>
                            <span>{likes.length > 0 ? likes.length : ''}</span>
                        </button>

                        <button
                            onClick={(e) => { e.preventDefault(); onCommentClick(activity); }}
                            className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-[#D67456] transition-colors"
                        >
                            <FaRegComment size={18} />
                            <span>Commenter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedItem;
