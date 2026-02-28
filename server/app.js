import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import helmet from "helmet";
import userBookingRoutes from "./routes/booking.js";
import adminBookingRoutes from "./routes/adminBooking.js";
import { requestLogger } from "./middleware/requestLogger.js";


dotenv.config();


connectDB();

const app = express();
app.use(helmet());
app.set("trust proxy", 1); 
app.use(requestLogger);

app.use(cors({
  origin: process.env.client_Url,
}));

app.use(express.json());



app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api", userBookingRoutes);
app.use("/api/admin", adminBookingRoutes);


app.use((err , req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});