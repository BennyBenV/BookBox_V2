import { useEffect, useState } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import UserListModal from '../components/UserListModal';
import { FaBook, FaCalendarAlt, FaChartBar, FaLayerGroup, FaPenNib, FaStar, FaBookReader } from 'react-icons/fa';

const Profile = () => {
    const { books, loading } = useBooks();
    const { user } = useAuth();
    const { getFollowers, getFollowing } = useUsers();
    const navigate = useNavigate();

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const [stats, setStats] = useState({
        totalBooks: 0,
        readBooks: 0,
        totalPages: 0,
        avgRating: 0,
        topAuthor: '-',
        ratingsCount: [0, 0, 0, 0, 0] // 1 to 5 stars
    });

    useEffect(() => {
        if (!books.length) return;

        let read = 0;
        let pages = 0;
        let totalRating = 0;
        let ratedBooksCount = 0;
        let authorCounts = {};
        let rCounts = [0, 0, 0, 0, 0];

        books.forEach(book => {
            // Count Status
            if (book.readingStatus === 'COMPLETED') {
                read++;
                if (book.pageCount) pages += book.pageCount;
            }

            // Count Ratings distribution
            if (book.rating > 0) {
                totalRating += book.rating;
                ratedBooksCount++;
                rCounts[book.rating - 1]++;
            }

            // Author Stats
            if (book.authors && book.authors.length > 0) {
                const author = book.authors[0]; // Take primary author
                authorCounts[author] = (authorCounts[author] || 0) + 1;
            }
        });

        // Find Top Author
        let topAuth = '-';
        let maxCount = 0;
        for (const [auth, count] of Object.entries(authorCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topAuth = auth;
            }
        }

        setStats({
            totalBooks: books.length,
            readBooks: read,
            totalPages: pages,
            avgRating: ratedBooksCount > 0 ? (totalRating / ratedBooksCount).toFixed(1) : 0,
            topAuthor: topAuth,
            ratingsCount: rCounts
        });

    }, [books]);

    // Fetch social data
    useEffect(() => {
        const fetchSocialData = async () => {
            if (user) {
                const [followersList, followingList] = await Promise.all([
                    getFollowers(user.id),
                    getFollowing(user.id)
                ]);
                setFollowers(followersList);
                setFollowing(followingList);
            }
        };
        fetchSocialData();
    }, [user, getFollowers, getFollowing]);

    const handleUserClick = (userId) => {
        if (userId === user.id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate(`/user/${userId}`);
        }
    };

    // Find Max for Chart normalization
    const maxRatingCount = Math.max(...stats.ratingsCount, 1);

    if (loading) return <div>Loading...</div>;

    const UserAvatar = () => (
        <div className="w-24 h-24 rounded-full bg-[#D67456] flex items-center justify-center text-4xl text-white font-serif font-bold shadow-lg border-4 border-white">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
                <UserAvatar />
                <div className="text-center md:text-left flex-grow w-full md:w-auto">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3E3026] dark:text-[#F5EFE7] mb-2">{user?.username}</h1>
                    <p className="text-[#8B7B6B] dark:text-[#C4B5A7] font-medium">Membre depuis {new Date().getFullYear()}</p>

                    {/* Stats Grid - 2x2 on Mobile, 1 row on Desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 w-full">
                        <div className="text-center px-4 py-3 bg-[#FAF7F5] dark:bg-[#3E352E] rounded-2xl border border-[#E8DDD4] dark:border-[#4A3F38]">
                            <span className="block text-xl md:text-2xl font-bold text-[#D67456]">{stats.readBooks}</span>
                            <span className="text-[10px] md:text-xs text-[#8B7B6B] dark:text-[#C4B5A7] uppercase font-bold tracking-wider">Lus</span>
                        </div>
                        <div className="text-center px-4 py-3 bg-[#FAF7F5] dark:bg-[#3E352E] rounded-2xl border border-[#E8DDD4] dark:border-[#4A3F38]">
                            <span className="block text-xl md:text-2xl font-bold text-[#9CAF88]">{books.length}</span>
                            <span className="text-[10px] md:text-xs text-[#8B7B6B] dark:text-[#C4B5A7] uppercase font-bold tracking-wider">Total</span>
                        </div>
                        <button
                            onClick={() => setShowFollowersModal(true)}
                            className="text-center px-4 py-3 bg-white dark:bg-[#3E352E] rounded-2xl border border-[#E8DDD4] dark:border-[#4A3F38] hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                            <span className="block text-xl md:text-2xl font-bold text-[#88A068] group-hover:text-[#D67456] transition-colors">{followers.length}</span>
                            <span className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider">Abonnés</span>
                        </button>
                        <button
                            onClick={() => setShowFollowingModal(true)}
                            className="text-center px-4 py-3 bg-white dark:bg-[#3E352E] rounded-2xl border border-[#E8DDD4] dark:border-[#4A3F38] hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                            <span className="block text-xl md:text-2xl font-bold text-[#D6A567] group-hover:text-[#D67456] transition-colors">{following.length}</span>
                            <span className="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider">Abonnements</span>
                        </button>
                    </div>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Chart */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Ratings Distribution Chart (Letterboxd Style) */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 text-lg font-serif">
                            <FaChartBar className="text-[#D67456]" /> Distribution des Notes
                        </h3>
                        <div className="flex items-end justify-between h-40 gap-2">
                            {stats.ratingsCount.map((count, index) => {
                                const heightPercentage = (count / maxRatingCount) * 100;
                                const starRating = index + 1;
                                return (
                                    <div key={index} className="h-full flex-1 flex flex-col justify-end items-center group relative cursor-help">
                                        <div
                                            className="w-full bg-[#D67456] rounded-t-sm relative transition-all duration-500 group-hover:bg-[#C96746] shadow-md"
                                            style={{ height: `${heightPercentage}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-lg">
                                                {count} livres
                                            </div>
                                        </div>
                                        <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-700 mt-1"></div>
                                        <div className="text-xs text-slate-500 font-bold mt-2 flex items-center">
                                            {starRating} <FaStar className="text-[10px] ml-0.5 text-amber-400" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Fun Stats */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-lg font-serif">Statistiques</h3>

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 rounded-full bg-orange-50 dark:bg-slate-700 text-[#D67456] group-hover:bg-[#D67456] group-hover:text-white transition-colors">
                                <FaLayerGroup />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPages.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Pages Lues</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 rounded-full bg-pink-50 dark:bg-slate-700 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                <FaPenNib />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={stats.topAuthor}>
                                    {stats.topAuthor}
                                </p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Auteur Favori</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 rounded-full bg-yellow-50 dark:bg-slate-700 text-yellow-500 group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                                <FaStar />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgRating}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Note Moyenne</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Library */}
                <div className="lg:col-span-2 animate-fade-in">
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                        <FaBook className="text-[#D67456]" /> Ajouts Récents
                    </h3>
                    {books.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 italic">Pas encore de livres. Ajoutez-en via la recherche !</p>
                            <button onClick={() => navigate('/discover')} className="mt-4 text-[#D67456] font-bold hover:underline">Découvrir des livres</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
