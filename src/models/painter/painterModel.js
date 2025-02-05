import mongoose from 'mongoose';

export const painterSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  mobile: { 
    type: Number, 
    unique: true 
  },
  email: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  password: {
     type: String 
    },
  otp: { 
    type: String 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

const Painter = mongoose.model('Painter', painterSchema);

export default Painter;
