/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    600: '#4f46e5',
                    900: '#312e81',
                },
            }
        },
    },
    plugins: [],
}
