//const express = require('express');
import express from "express";
const router = express.Router();
import Product from "../models/stockModel.js";

//const Product = require('../models/stockModel'); // Import your model

// POST route to save product details to database
router.get('/user-products', async (req, res) => {
    try {
      const products = await Product.find({ userId: req.user._id }); // Ensure `req.user` has the logged-in user's info
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  });
  
router.post('/additem', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(200).json({ message: "Product saved successfully!" });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Failed to save product." });
  }
});

export default router;
//module.exports = router;
