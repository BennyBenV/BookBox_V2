const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS - Must be first
app.use(cors({
    origin: (origin, callback) => {
        // Allow all in development or if no origin (mobile/curl)
        if (!origin || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:8080',
            process.env.CLIENT_URL
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin); // Log blocked origins
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Security Middleware
app.use(helmet()); // Set security headers

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
