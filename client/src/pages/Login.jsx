import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaBookOpen } from 'react-icons/fa';

import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Connexion réussie !');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Échec de la connexion');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in-up">
                <div className="text-center">
                    <img src={logo} alt="BookBox Logo" className="mx-auto w-24 h-24 object-contain mb-6 animate-pulse-slow" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                        Connexion
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Ravis de vous revoir sur BookBox
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-2xl shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 rounded-t-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] focus:z-10 text-base transition-all"
                                placeholder="Adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 rounded-b-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] focus:z-10 text-base transition-all"
                                placeholder="Mot de passe"
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
                            Se connecter
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <Link to="/register" className="font-medium text-[#D67456] hover:text-[#C96746] transition-colors">
                        Pas de compte ? Inscrivez-vous
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
