import express from 'express';
import Inventory from '../models/Inventory.js';

const router = express.Router();

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

export default router;