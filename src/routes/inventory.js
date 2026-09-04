import express from 'express';
import Inventory from '../models/Inventory.js';
import Medicine from '../models/Medicine.js';

const router = express.Router();

// GET /inventory/medicines - Fetch list of all available medicines in master catalog
router.get('/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory/medicines - Create new medicine in master catalog
router.post('/medicines', async (req, res) => {
    try {
        const { name, price, strength } = req.body;
        if (!name || price === undefined || !strength) {
            return res.status(400).json({ error: 'Medicine name, price, and strength are required.' });
        }

        const newMedicine = new Medicine({
            name,
            price: Number(price),
            strength
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /inventory/pharmacy/:pharmacyId - Fetch inventory by pharmacy ID
router.get('/pharmacy/:pharmacyId', async (req, res) => {
    try {
        const inventory = await Inventory.find({ pharmacyId: req.params.pharmacyId })
            .populate('medicineId');
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /inventory - Add new medicine to pharmacy inventory
router.post('/', async (req, res) => {
    try {
        const { pharmacyId, medicineId, quantity } = req.body;
        if (!pharmacyId || !medicineId || quantity === undefined) {
            return res.status(400).json({ error: 'pharmacyId, medicineId, and quantity are required.' });
        }

        // Check if inventory item already exists for this pharmacy
        let existingItem = await Inventory.findOne({ pharmacyId, medicineId });
        if (existingItem) {
            existingItem.quantity = Number(quantity);
            await existingItem.save();
            await existingItem.populate('medicineId');
            return res.json(existingItem);
        }

        const newItem = new Inventory({
            pharmacyId,
            medicineId,
            quantity: Number(quantity)
        });

        await newItem.save();
        await newItem.populate('medicineId');
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /inventory/:inventoryId - Update stock quantity
router.put('/:inventoryId', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.inventoryId,
            { quantity: req.body.quantity },
            { new: true, runValidators: true }
        ).populate('medicineId');

        if (!updatedItem) {
            return res.status(404).json({ error: 'Inventory record not found' });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /inventory/:inventoryId - Delete inventory item
router.delete('/:inventoryId', async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.inventoryId);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Inventory record not found' });
        }
        res.json({ message: 'Medicine removed from inventory successfully', id: req.params.inventoryId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;