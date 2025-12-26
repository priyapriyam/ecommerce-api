import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";




const app = express ();

//Middleware
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

//Routes

app.use("/api/auth",authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;