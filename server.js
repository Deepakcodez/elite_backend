import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import partnerRoutes from "./src/routes/partner.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import { categoryRoute,serviceRoute } from "./src/routes/index.js";
<<<<<<< HEAD
=======
import userRoutes from "./src/routes/user.route.js"
import adminRoutes from "./src/routes/admin.route.js"
>>>>>>> Shubham

const app = express();

dotenv.config();
connectDB();

app.use(express.json({extended: true}));

// Routes
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/service", serviceRoute);
<<<<<<< HEAD

// app.use('/api/partner', profileRoutes);

=======
app.use("/api/v1/User",userRoutes);
app.use("/api/v1/admin",adminRoutes);

// app.use('/api/partner', profileRoutes);


// Default route for all other requests
app.get("*", (req, res) => {
    res.status(200).json({ message: "Welcome to EliteFinish" });
});


>>>>>>> Shubham
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
