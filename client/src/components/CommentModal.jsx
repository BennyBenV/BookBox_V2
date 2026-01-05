import { useState, useEffect, useRef } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { FaTimes, FaPaperPlane, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CommentModal = ({ isOpen, onClose, bookId, bookTitle }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { getComments, addComment, deleteComment } = useBooks();
    const { user } = useAuth();
    const commentsEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && bookId) {
            fetchComments();
        }
    }, [isOpen, bookId]);

    const fetchComments = async () => {
        setLoading(true);
        const data = await getComments(bookId);
        setComments(data);
        setLoading(false);
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const addedComment = await addComment(bookId, newComment);
            // Append new comment locally to avoid full re-fetch or wait for it
            // The backend returns the populated comment usually, need to check controller
            // Controller does: await comment.populate('user', 'username');
            setComments([...comments, addedComment]);
            setNewComment('');
            // Scroll to bottom
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('Voulez-vous supprimer ce commentaire ?')) {
            await deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose} // Close when clicking backdrop
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Commentaires</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[250px]">{bookTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-800 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D67456]"></div>
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-slate-400 dark:text-slate-500 py-8 italic text-sm">
                            Aucun commentaire pour le moment.<br />Soyez le premier à réagir !
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D67456] flex items-center justify-center text-white text-xs font-bold font-serif">
                                    {comment.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-grow">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl rounded-tl-none text-sm relative group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                                                {comment.user.username}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                                            {comment.content}
                                        </p>

                                        {user && user.id === comment.user._id && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="absolute right-2 bottom-2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Supprimer"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Écrivez un commentaire..."
                            className="flex-grow px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D67456] focus:border-transparent dark:text-white dark:placeholder-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="p-2.5 rounded-full bg-[#D67456] text-white hover:bg-[#C96746] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex-shrink-0"
                        >
                            <FaPaperPlane size={14} className="-ml-0.5 mt-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
