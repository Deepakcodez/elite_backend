import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import partnerRoutes from './routes/partnerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();
const app = express();
  
app.use(express.json());

// Routes
app.use('/api/partner', partnerRoutes);
app.use('/api/partner', bookingRoutes);
app.use('/api/partner', profileRoutes);

connectDB();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
