if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const receiptRoutes = require('./routes/receipts'); // Ensure the path matches your directory structure
const protectedRoutes = require('./routes/protectedRoutes');
const verifyToken = require('./middleware/authenticateToken'); // Path might need adjustment
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 5000;

// After all your routes
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
});

// Middleware
// Define CORS options
const corsOptions = {
  origin: 'http://fridger.s3-website-us-east-1.amazonaws.com', // Adjust as per your actual S3 URL
  credentials: true, // Allow credentials (cookies, sessions) to be sent
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight requests
};

// Apply CORS with the specified options
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

// Then, define your routes.

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/user', authRoutes); // User-related routes
app.use('/api', protectedRoutes);
app.use('/api/receipts', verifyToken, receiptRoutes);
app.use('/api/stock', stockRoutes); // Use the stock route

// Example of a protected route
app.get('/api/protected', verifyToken, (req, res) => {
  // If the token is valid, the request will have the user's info attached to it (req.user)
  // Here you could fetch more data related to the user or simply return a success message
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
