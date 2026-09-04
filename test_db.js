import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/db.js';
import Pharmacy from './src/models/Pharmacy.js';

async function inspectPharmacies() {
    await connectDB();
    const pharmacies = await Pharmacy.find({});
    console.log("Pharmacies in DB:", pharmacies);
    await mongoose.disconnect();
    process.exit(0);
}

inspectPharmacies();
