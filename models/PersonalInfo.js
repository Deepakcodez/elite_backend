import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fathersName: { type: String, required: true },
    dob: { type: Date, required: true },
    primaryMobile: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    secondaryMobile: { type: String },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    languages: [{ type: String }],
    profilePicture: { type: String },
    referralCode: { type: String }
}, { timestamps: true });

export default mongoose.model('PersonalInfo', personalInfoSchema);
