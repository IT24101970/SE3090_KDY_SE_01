import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Model Imports
import Pharmacy from './src/models/Pharmacy.js';
import Inventory from './src/models/Inventory.js';

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

// GET /api/pharmacies - Fetch list of all pharmacies
app.get('/api/pharmacies', async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().sort({ name: 1 });
        res.json(pharmacies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/cities - Fetch distinct cities from Pharmacy collection
app.get('/api/cities', async (req, res) => {
    try {
        const rawCities = await Pharmacy.distinct('city');
        const sortedCities = rawCities.filter(Boolean).sort();
        res.json(['All', ...sortedCities]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/search - Search medicines across inventory and pharmacies
app.get('/api/search', async (req, res) => {
    try {
        const { medicine: medicineQuery = '', city: cityQuery = 'All' } = req.query;

        const allInventories = await Inventory.find({ quantity: { $gt: 0 } })
            .populate('pharmacyId')
            .populate('medicineId');

        const trimmedMedQuery = medicineQuery.toLowerCase().trim();
        const trimmedCityQuery = cityQuery.toLowerCase().trim();

        const matchingInvs = allInventories.filter(inv => {
            if (!inv.pharmacyId || !inv.medicineId) return false;

            const matchesMed = !trimmedMedQuery ||
                inv.medicineId.name.toLowerCase().includes(trimmedMedQuery) ||
                inv.medicineId.strength.toLowerCase().includes(trimmedMedQuery);

            const matchesCity = trimmedCityQuery === 'all' ||
                inv.pharmacyId.city.toLowerCase() === trimmedCityQuery;

            return matchesMed && matchesCity;
        });

        const resultMap = {};

        matchingInvs.forEach(inv => {
            const pharmId = inv.pharmacyId._id.toString();
            if (!resultMap[pharmId]) {
                resultMap[pharmId] = {
                    _id: inv.pharmacyId._id,
                    name: inv.pharmacyId.name,
                    address: inv.pharmacyId.address,
                    city: inv.pharmacyId.city,
                    contact: inv.pharmacyId.contact,
                    openHours: inv.pharmacyId.openHours,
                    availableMedicines: []
                };
            }
            resultMap[pharmId].availableMedicines.push({
                _id: inv.medicineId._id,
                name: inv.medicineId.name,
                strength: inv.medicineId.strength,
                price: inv.medicineId.price,
                quantity: inv.quantity,
                inventoryId: inv._id
            });
        });

        res.json(Object.values(resultMap));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('Medicine Finder SL API is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
});