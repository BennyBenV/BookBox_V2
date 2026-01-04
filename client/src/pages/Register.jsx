import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUserPlus, FaExclamationCircle } from 'react-icons/fa';

import logo from '../assets/logo.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const [errors, setErrors] = useState([]);

    const validateForm = () => {
        const newErrors = [];
        if (username.length < 3) newErrors.push("Le nom d'utilisateur doit dépasser 3 caractères");
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.push("Format d'email invalide");
        if (password.length < 8) newErrors.push("Le mot de passe doit faire au moins 8 caractères");

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        if (!validateForm()) return;

        try {
            await register(username, email, password);
            toast.success('Compte créé avec succès !');
            navigate('/');
        } catch (error) {
            const data = error.response?.data || {};
            // Combine all errors into the list
            if (data.message) {
                setErrors(prev => [...prev, data.message]);
            } else {
                setErrors(prev => [...prev, "Échec de l'inscription"]);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in-up">
                <div className="text-center">
                    <img src={logo} alt="BookBox Logo" className="mx-auto w-24 h-24 object-contain mb-6 animate-pulse-slow" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Commencez votre voyage littéraire
                    </p>
                </div>

                {/* Unified Error Block */}
                {errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center gap-2 mb-2">
                            <FaExclamationCircle className="text-red-500" />
                            <h4 className="text-red-700 dark:text-red-200 font-bold text-sm">Action requise</h4>
                        </div>
                        <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1">
                            {errors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-2xl shadow-sm -space-y-px">
                        <div>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-t-2xl relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] focus:z-10 text-base transition-all"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] focus:z-10 text-base transition-all"
                                placeholder="Adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-b-2xl relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] focus:z-10 text-base transition-all"
                                placeholder="Mot de passe (8+ caractères)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-2xl text-white bg-[#D67456] hover:bg-[#C96746] focus:outline-none focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-900/30 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <Link to="/login" className="font-medium text-[#D67456] hover:text-[#C96746] transition-colors">
                        Déjà un compte ? Connectez-vous
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
