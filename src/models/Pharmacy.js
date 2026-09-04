import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contact: { type: String, required: true },
    openHours: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Pharmacy', pharmacySchema);