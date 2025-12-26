import mongoose from "mongoose";
import Product from "../models/productModel.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
    });


    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// VIEW / GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
      error: error.message,
    });
  }
};


export const getAllProductsById = async (req, res) => {
  try {
    const id = req.params.id;  // get id from URL

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found by this id",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

//update by id;-
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Find product by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body }, // update with data from request body
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

