import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Route Imports
import inventoryRoutes from './src/routes/inventory.js';

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/inventory', inventoryRoutes);


// Health Check Route
app.get('/', (req, res) => {
    res.send('Medicine Finder SL API is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});