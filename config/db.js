import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`, conn);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

export default connectDB;
