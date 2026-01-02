import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { FaMoon, FaSun, FaUser, FaLayerGroup, FaSearch, FaUserFriends, FaBook } from 'react-icons/fa';

import logo from '../assets/logo.png';

const Layout = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();

    const navLinks = [
        { path: '/', icon: <FaLayerGroup size={20} />, label: 'Accueil' },
        { path: '/discover', icon: <FaSearch size={20} />, label: 'Découvrir' },
        { path: '/feed', icon: <FaUserFriends size={20} />, label: 'Fil' },
        { path: '/library', icon: <FaBook size={20} />, label: 'Ma Biblio' },
        { path: '/profile', icon: <FaUser size={20} />, label: 'Profil' },
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Top Navbar (Desktop) */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:static lg:transform-none lg:left-auto lg:top-auto">
                            <Link to="/" className="flex items-center gap-3">
                                <img src={logo} alt="BookBox Logo" className="h-14 lg:h-12 w-auto object-contain transition-transform group-hover:scale-110" />
                                <span className="hidden lg:block font-serif font-bold text-2xl text-[#3E3026] dark:text-[#F5EFE7] tracking-tight group-hover:text-[#D67456] dark:group-hover:text-[#D67456] transition-colors relative top-[1px]">
                                    BookBox
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-1 mr-2">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#8B7B6B] dark:text-[#C4B5A7] hover:text-[#D67456] hover:bg-orange-50 dark:hover:bg-slate-700 dark:hover:text-[#D67456] transition-all"
                                            >
                                                {link.icon}
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Dark Mode Toggle */}
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                                        aria-label="Toggle dark mode"
                                    >
                                        {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                                    </button>

                                    {/* User Profile Icon */}
                                    <Link
                                        to="/profile"
                                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                                        aria-label="My Profile"
                                    >
                                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-[#D67456] dark:text-slate-200 font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>

                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                                    >
                                        Déconnexion
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Dark Mode Toggle for logged out users */}
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                                        aria-label="Toggle dark mode"
                                    >
                                        {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                                    </button>
                                    <Link to="/login" className="text-sm font-bold text-[#8B7B6B] dark:text-[#C4B5A7] hover:text-[#D67456] dark:hover:text-[#D67456] transition-colors">
                                        Connexion
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-[#D67456] hover:bg-[#C96746] dark:bg-[#D67456] dark:hover:bg-[#C96746] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-orange-200 dark:shadow-none hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                    >
                                        Commencer
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Header Icons (Right side) */}
                        <div className="flex lg:hidden items-center gap-3 ml-auto">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                            >
                                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                            </button>
                            {user && (
                                <button
                                    onClick={logout}
                                    className="text-sm font-bold text-slate-500 dark:text-slate-400"
                                >
                                    Log out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow max-w-7xl mx-auto w-full pb-24 lg:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            {user && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
                    <div className="flex justify-around items-center h-16 px-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 dark:text-slate-500 hover:text-[#D67456] dark:hover:text-[#D67456] active:text-[#D67456] transition-colors"
                            >
                                <span className="hover:scale-110 transition-transform">{link.icon}</span>
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <footer className="hidden lg:block bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-12 mt-12">
                <div className="text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                    © {new Date().getFullYear()} BookBox. Votre Bibliothèque Numérique Personnelle.
                </div>
            </footer>

            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        borderRadius: '0.75rem',
                        marginBottom: '4rem', // Above bottom nav
                    },
                }}
            />
        </div>
    );
};

export default Layout;
