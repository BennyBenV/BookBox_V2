import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaUserPlus, FaUserMinus, FaBookReader, FaBook, FaCalendarAlt, FaStar, FaPlus, FaCheckCircle } from 'react-icons/fa';
import BookCard from '../components/BookCard';
import UserListModal from '../components/UserListModal';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getUserProfile, followUser, unfollowUser, getFollowers, getFollowing, getUserLibrary } = useUsers();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [library, setLibrary] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('library');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const data = await getUserProfile(id);
            if (data) {
                setProfile(data);
                // Check if current user is following this user
                setIsFollowing(data.followers.some(f => f._id === currentUser.id || f === currentUser.id));

                // Fetch followers, following lists, and library
                const [followersList, followingList, userLibrary] = await Promise.all([
                    getFollowers(id),
                    getFollowing(id),
                    getUserLibrary(id)
                ]);
                setFollowers(followersList);
                setFollowing(followingList);
                setLibrary(userLibrary);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [id, getUserProfile, getFollowers, getFollowing, getUserLibrary, currentUser]);

    const handleFollow = async () => {
        await followUser(id);
        setIsFollowing(true);
        // Update follower count locally
        setFollowers([...followers, { _id: currentUser.id, username: currentUser.username }]);
        toast.success(`You are now following ${profile.username}`);
    };

    const handleUnfollow = async () => {
        await unfollowUser(id);
        setIsFollowing(false);
        // Update follower count locally
        setFollowers(followers.filter(f => f._id !== currentUser.id));
        toast.success(`Unfollowed ${profile.username}`);
    };

    const handleUserClick = (userId) => {
        if (userId === currentUser.id) {
            navigate('/profile');
        } else {
            navigate(`/user/${userId}`);
        }
    };

    // Calculate Activity from Library
    const activity = library.map(book => ({
        type: book.readingStatus === 'COMPLETED' && book.dateCompleted ? 'COMPLETED' :
            book.rating > 0 ? 'RATED' : 'ADDED',
        date: new Date(book.dateAdded),
        book: book,
        rating: book.rating,
        review: book.personalReview
    })).sort((a, b) => b.date - a.date);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67456]"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Utilisateur non trouvé</h2>
                <button onClick={() => navigate('/')} className="text-[#D67456] dark:text-[#D67456] hover:underline">
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#8B7B6B] dark:text-[#C4B5A7] hover:text-[#D67456] dark:hover:text-[#D67456] mb-6 transition-colors font-medium group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Retour
                </button>

                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto text-center md:text-left">
                            <div className="w-24 h-24 rounded-full bg-[#D67456] flex items-center justify-center text-white font-bold text-4xl shadow-lg font-serif border-4 border-white flex-shrink-0">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="w-full md:w-auto">
                                <h1 className="text-3xl font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-2 font-serif">{profile.username}</h1>
                                <p className="text-[#8B7B6B] dark:text-[#C4B5A7]">Membre depuis {new Date(profile.createdAt).getFullYear()}</p>

                                <div className="grid grid-cols-2 gap-4 mt-6 w-full md:w-auto md:flex md:gap-6">
                                    <button
                                        onClick={() => setShowFollowersModal(true)}
                                        className="text-center bg-slate-50 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 px-4 py-3 rounded-xl transition-colors border border-slate-100 dark:border-slate-600 group w-full md:w-auto"
                                    >
                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#D67456] transition-colors">{followers.length}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wide">Abonnés</p>
                                    </button>
                                    <button
                                        onClick={() => setShowFollowingModal(true)}
                                        className="text-center bg-slate-50 dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 px-4 py-3 rounded-xl transition-colors border border-slate-100 dark:border-slate-600 group w-full md:w-auto"
                                    >
                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#D67456] transition-colors">{following.length}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wide">Abonnements</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Follow/Unfollow Button */}
                        {currentUser.id !== id && (
                            <div className="w-full md:w-auto mt-2 md:mt-0">
                                {isFollowing ? (
                                    <button
                                        onClick={handleUnfollow}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium shadow-sm"
                                    >
                                        <FaUserMinus /> Ne plus suivre
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D67456] hover:bg-[#C96746] text-white transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        <FaUserPlus /> Suivre
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <UserListModal
                    isOpen={showFollowersModal}
                    onClose={() => setShowFollowersModal(false)}
                    title="Abonnés"
                    users={followers}
                    onUserClick={handleUserClick}
                />

                <UserListModal
                    isOpen={showFollowingModal}
                    onClose={() => setShowFollowingModal(false)}
                    title="Abonnements"
                    users={following}
                    onUserClick={handleUserClick}
                />

                {/* Content Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`pb-4 px-6 font-bold text-sm transition-colors relative ${activeTab === 'library' ? 'text-[#D67456]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        <span className="flex items-center gap-2"><FaBook /> Bibliothèque</span>
                        {activeTab === 'library' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D67456]"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`pb-4 px-6 font-bold text-sm transition-colors relative ${activeTab === 'activity' ? 'text-[#D67456]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                        <span className="flex items-center gap-2"><FaCalendarAlt /> Activité Récente</span>
                        {activeTab === 'activity' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D67456]"></div>}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'library' ? (
                    <div className="animate-fade-in">
                        {library.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {library.map((book) => (
                                    <BookCard key={book._id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <FaBook className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 italic">
                                    La bibliothèque de cet utilisateur est vide.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                        {activity.length > 0 ? (
                            activity.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-6 hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-16 h-24 bg-slate-200 rounded-md overflow-hidden shadow-sm">
                                        {item.book.imageLinks?.thumbnail ? (
                                            <img src={item.book.imageLinks.thumbnail} alt={item.book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center"><FaBook className="text-slate-300" /></div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-bold text-[#D67456] bg-orange-50 dark:bg-slate-700 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                                                {item.type === 'COMPLETED' ? 'Terminé' : item.type === 'RATED' ? 'Noté' : 'Ajouté'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{item.date.toLocaleDateString()}</span>
                                        </div>

                                        <p className="font-serif font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-[#D67456] transition-colors cursor-pointer" onClick={() => navigate(`/book/${item.book.googleId}`)}>{item.book.title}</p>

                                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                            {item.type === 'COMPLETED' && <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> a terminé ce livre</span>}
                                            {item.type === 'RATED' && <span className="flex items-center gap-2"><FaStar className="text-amber-400" /> a donné une note</span>}
                                            {item.type === 'ADDED' && <span className="flex items-center gap-2"><FaPlus className="text-blue-500" /> a ajouté à sa bibliothèque</span>}
                                        </p>

                                        {item.rating > 0 && (
                                            <div className="flex text-amber-400 text-sm mb-2">
                                                {[...Array(5)].map((_, i) => <FaStar key={i} className={i < item.rating ? '' : 'text-slate-200 dark:text-slate-600'} />)}
                                            </div>
                                        )}

                                        {item.review && (
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-slate-600 dark:text-slate-400 italic text-sm border border-slate-100 dark:border-slate-800 relative">
                                                <span className="absolute top-2 left-2 text-3xl text-slate-200 dark:text-slate-700 leading-none">"</span>
                                                <p className="relative z-10 pl-4">{item.review}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 italic">Aucune activité récente à afficher.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
