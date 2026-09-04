import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    strength: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);