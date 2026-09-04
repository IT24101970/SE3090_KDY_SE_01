import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import Pharmacy from './src/models/Pharmacy.js';
import Medicine from './src/models/Medicine.js';
import Inventory from './src/models/Inventory.js';
import User from './src/models/User.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Clearing existing database collections...');
        await Pharmacy.deleteMany({});
        await Medicine.deleteMany({});
        await Inventory.deleteMany({});
        await User.deleteMany({});

        console.log('Inserting Users...');
        const users = await User.insertMany([
            { email: "admin@pharmacy.com", password: "adminpassword123", role: "admin" },
            { email: "seller@healthplus.com", password: "sellerpassword123", role: "seller" }
        ]);
        const sellerUser = users[1];

        console.log('Inserting Pharmacies...');
        const pharmacies = await Pharmacy.insertMany([
            {
                userId: sellerUser._id,
                name: "HealthPlus Pharmacy",
                address: "123 Galle Road, Bambalapitiya",
                city: "Colombo",
                contact: "+94 11 258 9630",
                openHours: "8:00 AM - 10:00 PM"
            },
            {
                userId: sellerUser._id,
                name: "Lanka Care Pharmacy",
                address: "45 Peradeniya Road",
                city: "Kandy",
                contact: "+94 81 223 4567",
                openHours: "7:30 AM - 9:30 PM"
            },
            {
                userId: sellerUser._id,
                name: "MediQuick Pharmacy & Wellness",
                address: "88 Main Street",
                city: "Galle",
                contact: "+94 91 432 1890",
                openHours: "24 Hours"
            },
            {
                userId: sellerUser._id,
                name: "City Pharma Colombo",
                address: "12 Union Place, Slave Island",
                city: "Colombo",
                contact: "+94 11 471 2300",
                openHours: "8:30 AM - 11:00 PM"
            }
        ]);

        console.log('Inserting Medicines...');
        const medicines = await Medicine.insertMany([
            { name: "Paracetamol", price: 12.50, strength: "500mg" },
            { name: "Amoxicillin", price: 45.00, strength: "250mg" },
            { name: "Omeprazole", price: 30.00, strength: "20mg" },
            { name: "Cetirizine", price: 15.00, strength: "10mg" },
            { name: "Metformin", price: 25.00, strength: "500mg" },
            { name: "Ibuprofen", price: 18.00, strength: "400mg" }
        ]);

        console.log('Inserting Inventory items...');
        await Inventory.insertMany([
            { pharmacyId: pharmacies[0]._id, medicineId: medicines[0]._id, quantity: 150 },
            { pharmacyId: pharmacies[0]._id, medicineId: medicines[1]._id, quantity: 30 },
            { pharmacyId: pharmacies[0]._id, medicineId: medicines[2]._id, quantity: 8 },
            { pharmacyId: pharmacies[1]._id, medicineId: medicines[0]._id, quantity: 200 },
            { pharmacyId: pharmacies[1]._id, medicineId: medicines[3]._id, quantity: 50 },
            { pharmacyId: pharmacies[2]._id, medicineId: medicines[0]._id, quantity: 90 },
            { pharmacyId: pharmacies[2]._id, medicineId: medicines[1]._id, quantity: 15 },
            { pharmacyId: pharmacies[2]._id, medicineId: medicines[4]._id, quantity: 100 },
            { pharmacyId: pharmacies[3]._id, medicineId: medicines[1]._id, quantity: 60 },
            { pharmacyId: pharmacies[3]._id, medicineId: medicines[2]._id, quantity: 45 },
            { pharmacyId: pharmacies[3]._id, medicineId: medicines[5]._id, quantity: 5 }
        ]);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
