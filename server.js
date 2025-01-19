import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import partnerRoutes from "./src/routes/partner.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import { categoryRoute } from "./src/routes/index.js";

const app = express();

dotenv.config();
connectDB();

app.use(express.json({extended: true}));

// Routes
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/category", categoryRoute);

// app.use('/api/partner', profileRoutes);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
