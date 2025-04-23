const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./utils/db');

// Routes
const productRoutes = require('./routes/products'); 
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.LIVE_FRONTEND_URL, 'https://your-frontend-domain.com'] 
  : ['http://localhost:3000'];

// Connect DB
connectDB();

// Middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/products', productRoutes); // Calls routes from products.js
app.use('/users', userRoutes);       // Calls routes from users.js
app.use('/auth', authRoutes);         // Calls routes from authRoutes.js     

// Root
app.get('/', (req, res) => {
    res.send('Hello world products');
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
 