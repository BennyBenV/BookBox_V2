import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaImage, FaSave, FaArrowLeft } from 'react-icons/fa';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setProfilePicture(user.profilePicture || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (password && password.length < 8) {
            toast.error("Le mot de passe doit faire au moins 8 caractères");
            return;
        }

        try {
            setLoading(true);
            const userData = {
                username,
                email,
                profilePicture,
            };

            if (password) {
                userData.password = password;
            }

            await updateProfile(userData);
            toast.success("Profil mis à jour avec succès !");
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-2xl animate-fade-in-up">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
                <FaArrowLeft className="mr-2" /> Retour
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-[#D67456] px-8 py-6">
                    <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                        <FaUser /> Paramètres du profil
                    </h1>
                    <p className="text-orange-100 mt-1 opacity-90">Modifiez vos informations personnelles</p>
                </div>

                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-slate-200">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400">
                                        <FaUser size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar URL */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Photo de profil (URL)
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaImage className="text-slate-400" />
                                </div>
                                <input
                                    type="url"
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-[#D67456] focus:border-[#D67456] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={profilePicture}
                                    onChange={(e) => setProfilePicture(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Collez ici le lien d'une image (ex: Imgur, Pinterest)</p>
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nom d'utilisateur
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-[#D67456] focus:border-[#D67456] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-400 font-bold">@</span>
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-[#D67456] focus:border-[#D67456] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700 my-6" />

                        {/* Password */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <FaLock className="text-[#D67456]" /> Changer le mot de passe
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <input
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-[#D67456] focus:border-[#D67456] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="password"
                                        placeholder="Confirmer"
                                        className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-[#D67456] focus:border-[#D67456] bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#D67456] hover:bg-[#c56a4e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D67456] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                            >
                                {loading ? 'Enregistrement...' : <>
                                    <FaSave className="mr-2 text-lg" /> Sauvegarder les modifications
                                </>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
