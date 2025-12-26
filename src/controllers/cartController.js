import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

export const createCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // 1. Check if product exists
    const product = await Product.findById(productId);
    console.log(product,"--")
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Find cart for user
    let cart = await Cart.findOne({ user: userId });

    // 3. If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // 4. Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product not in cart, add new item
        cart.items.push({ product: productId, quantity });
      }
    }

    // 5. Save cart
    await cart.save();

    // 6. Return updated cart
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // from token
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//update cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id; // from token
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id; // from token
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//delete cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id; // from token

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


