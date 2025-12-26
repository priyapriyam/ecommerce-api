import express from "express";
import {
  createProduct,
  getAllProducts,
  getAllProductsById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// POST - Create product
router.post("/create", createProduct);

router.get("/all", getAllProducts);

router.get("/:id", getAllProductsById);

// UPDATE PRODUCT by id
router.put("/update/:id", updateProduct);

// Delete PRODUCT by id

router.delete("/delete/:id", deleteProduct);

export default router;
