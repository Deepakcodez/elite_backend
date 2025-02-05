import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Painter",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  professionalTitle: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  address: {
    line1: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    area: {
      type: String
    },
  },
  yearsOfExperience: {
    type: String, enum: ["0-2", "2-5", "5-10", "10+"],
    required: true
  },
  gallery: {
    type: [String] // Array of image URLs
  },
  certifications: {
    type: [String]
  },
  skills: {
    type: [String]
  },
  serviceArea: {
    type: String
  },
  teamSize: {
    type: Number
  },
  availability: {
    type: String
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    perSqFeet: {
      type: Boolean,
      default: false
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
