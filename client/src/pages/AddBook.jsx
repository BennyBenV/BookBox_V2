import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { FaArrowLeft, FaBook, FaPlus } from 'react-icons/fa';

const AddBook = () => {
    const navigate = useNavigate();
    const { addBook } = useBooks();
    const [formData, setFormData] = useState({
        title: '',
        authors: '',
        description: '',
        pageCount: '',
        readingStatus: 'TO_READ',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert authors string to array
            const bookData = {
                ...formData,
                authors: formData.authors.split(',').map(a => a.trim()),
                pageCount: Number(formData.pageCount) || 0
            };
            await addBook(bookData);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors font-medium group"
                >
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à la bibliothèque
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 sm:p-10 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#D67456] rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-3">
                            <FaBook className="text-xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Ajouter un Livre</h1>
                            <p className="text-slate-500 dark:text-slate-400">Remplissez les détails pour ajouter un livre manuellement</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Titre *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] transition-all outline-none"
                                placeholder="ex: Harry Potter à l'école des sorciers"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Auteurs (séparés par des virgules)</label>
                            <input
                                type="text"
                                name="authors"
                                value={formData.authors}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] transition-all outline-none"
                                placeholder="ex: J.K. Rowling"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre de pages</label>
                                <input
                                    type="number"
                                    name="pageCount"
                                    value={formData.pageCount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Statut de lecture</label>
                                <div className="relative">
                                    <select
                                        name="readingStatus"
                                        value={formData.readingStatus}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="TO_READ">À lire</option>
                                        <option value="READING">En lecture</option>
                                        <option value="COMPLETED">Terminé</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-orange-100 dark:focus:ring-slate-600 focus:border-[#D67456] transition-all outline-none"
                                placeholder="Ajoutez un résumé ou vos notes..."
                            />
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#D67456] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#C96746] transition-all transform hover:-translate-y-0.5"
                            >
                                <FaPlus /> Ajouter le livre
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
