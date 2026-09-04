import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Pharmacy from './src/models/Pharmacy.js';
import Medicine from './src/models/Medicine.js';
import inventoryRoutes from './src/routes/inventory.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// GET /api/pharmacies - Fetch list of all pharmacies
app.get('/api/pharmacies', async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().sort({ name: 1 });
        res.json(pharmacies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines - Fetch all medicines catalog
app.get('/api/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/medicines - Add new medicine to catalog
app.post('/api/medicines', async (req, res) => {
    try {
        const { name, price, strength } = req.body;
        if (!name || price === undefined || !strength) {
            return res.status(400).json({ message: 'Medicine name, price, and strength are required.' });
        }

        const newMedicine = new Medicine({
            name,
            price: Number(price),
            strength
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /api/login - Authenticate user by email or _id
app.post('/api/login', async (req, res) => {
    try {
        const { identifier, email, userId, user_id, password } = req.body;
        const searchId = identifier || email || userId || user_id;

        if (!searchId || !password) {
            return res.status(400).json({ message: 'User ID / Email and Password are required' });
        }

        const query = [{ email: searchId }];
        if (mongoose.Types.ObjectId.isValid(searchId)) {
            query.push({ _id: searchId });
        }

        const user = await User.findOne({ $or: query });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid User ID / Email or Password' });
        }

        let pharmacy = null;
        if (user.role === 'seller' || user.role === 'pharmacist') {
            pharmacy = await Pharmacy.findOne({ userId: user._id });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                _id: user._id,
                email: user.email,
                role: user.role
            },
            pharmacy
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error during login' });
    }
});

// /api/inventory routes
app.use('/api/inventory', inventoryRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Medicine Finder SL API is Running...');
});

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

export default app;