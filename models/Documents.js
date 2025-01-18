import mongoose from 'mongoose';

const documentsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalInfo', required: true },
    aadhaarCard: { type: String, required: true },
    panCard: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Documents', documentsSchema);
