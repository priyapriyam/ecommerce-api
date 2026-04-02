import express from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";




const app = express ();

//Middleware
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

//Routes

app.use("/api/auth",authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Error handling middleware
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;