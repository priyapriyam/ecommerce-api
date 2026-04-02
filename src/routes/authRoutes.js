import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

//Register
router.post("/register", validateRegister, handleValidationErrors, registerUser);

//Login
router.post("/login", validateLogin, handleValidationErrors, loginUser);

export default router;