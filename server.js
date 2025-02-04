import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import partnerRoutes from "./src/routes/partner.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import { categoryRoute,serviceRoute } from "./src/routes/index.js";
import userRoutes from "./src/routes/user.route.js"
import adminRoutes from "./src/routes/admin.route.js"
import painterRoutes from "./src/routes/painter.route.js";

const app = express();

dotenv.config();
connectDB();

app.use(express.json({extended: true}));

// Routes
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/service", serviceRoute);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/painter",painterRoutes);

// app.use('/api/partner', profileRoutes);


// Default route for all other requests
app.get("*", (req, res) => {
    res.status(200).json({ message: "Welcome to EliteFinish" });
});


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}/`));
