import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const UserListModal = ({ isOpen, onClose, title, users, onUserClick }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <FaTimes className="text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                    {users.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => {
                                        onUserClick(user._id);
                                        onClose();
                                    }}
                                    className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-all border border-slate-100 dark:border-slate-700 hover:shadow-md"
                                >
                                    <div className="w-12 h-12 rounded-full bg-[#D67456] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{user.username}</p>
                                        {user.createdAt && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Member since {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">No users to display</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListModal;
