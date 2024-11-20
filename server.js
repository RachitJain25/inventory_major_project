import nodemailer from "nodemailer";
import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import Product from "./models/stockModel.js";
import User from "./models/userModel.js";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoutes.js";

// Configure environment variables
dotenv.config();

// Database configuration
connectDB();

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: "homecart852@gmail.com", // Replace with your email
    pass: "sotcyckyhgxqoilg", // Replace with your email password or app password
  },
});

// Function to send email alert
const sendEmailAlert = async (email, product) => {
  try {
    const mailOptions = {
      from: "homecart852@gmail.com", // Replace with your email
      to: email,
      subject: `Stock Alert: ${product.title} is out of stock`,
      text: `Dear User,\n\nThe stock for the product "${product.title}" has reached zero and has been removed from your inventory.\n\nThank you.\n- HomeCart Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Stock alert email sent successfully.");
  } catch (error) {
    console.error("Error sending stock alert email:", error);
  }
};
// Routes configuration
app.use("/api/v1/auth", authRoutes);

// PUT route to update product details by ID
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (updatedProduct) {
      res
        .status(200)
        .send({
          message: "Product updated successfully",
          product: updatedProduct,
        });
    } else {
      res
        .status(404)
        .send({
          message:
            "Product not found or you don't have permission to update it",
        });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ message: "Failed to update product" });
  }
});

//POST route to add or update a product by barcode
// app.post('/api/products', async (req, res) => {
//   try {
//     const { barcode, userId } = req.body;

//     // Check if product exists for the given userId and barcode
//     const existingProduct = await Product.findOne({ userId, barcode });
// console.log(barcode);
// console.log(userId);
// console.log("drgd");
// console.log('API called for barcode:', barcode, 'and userId:', userId);

//     if (existingProduct) {
//       // If the product exists, update the current stock
//       existingProduct.currentStock += 1;
//       await existingProduct.save();
//       res.status(200).send({ message: 'Product stock updated successfully', product: existingProduct });
//     } else {
//       // If no product exists with the given barcode and userId, create a new product
//       const newProduct = new Product(req.body);
//       await newProduct.save();
//       res.status(201).send({ message: 'New product saved successfully', product: newProduct });
//     }
//   } catch (error) {
//     console.error('Error saving/updating product:', error);
//     // Handling duplicate key error specifically
//     if (error.code === 11000) {
//       res.status(400).send({ message: 'Product already exists for this user.' });
//     } else {
//       res.status(500).send({ message: 'Failed to save/update product in database' });
//     }
//   }
// });
app.post("/api/products", async (req, res) => {
  try {
    const { barcode, userId } = req.body;

    console.log(barcode);
    console.log(userId);
    console.log("drgd");
    console.log("API called for barcode:", barcode, "and userId:", userId);

    // Check if product exists for the given userId and barcode
    let existingProduct = await Product.findOneAndUpdate(
      { userId, barcode },
      { $inc: { currentStock: 1 } },
      { new: true }
    );

    if (existingProduct) {
      // If the product exists and was updated
      res
        .status(200)
        .send({
          message: "Product stock updated successfully",
          product: existingProduct,
        });
    } else {
      // If no product exists with the given barcode and userId, create a new product
      const newProduct = new Product({ ...req.body, currentStock: 1 });
      await newProduct.save();
      res
        .status(201)
        .send({
          message: "New product saved successfully",
          product: newProduct,
        });
    }
  } catch (error) {
    console.error("Error saving/updating product:", error);
    // Handling duplicate key error specifically
    if (error.code === 11000) {
      res
        .status(400)
        .send({ message: "Product already exists for this user." });
    } else {
      res
        .status(500)
        .send({ message: "Failed to save/update product in database" });
    }
  }
});

// POST route to update or decrease a product's stock by barcode
// app.post('/api/delete/products', async (req, res) => {
//   try {
//     const { barcode, userId } = req.body;

//     // Validate input
//     if (!barcode || !userId) {
//       return res.status(400).send({ message: 'Barcode and userId are required.' });
//     }

//     // Find the product for the given userId and barcode
//     const existingProduct = await Product.findOne({ userId, barcode });
//     if (existingProduct) {
//       // Check if current stock is greater than 0
//       if (existingProduct.currentStock > 0) {
//         existingProduct.currentStock -= 1; // Decrease the stock by 1

//         // If stock reaches 0, delete the product from the database
//         if (existingProduct.currentStock === 0) {
//           await Product.deleteOne({ userId, barcode });
//           return res.status(200).send({ message: 'Product deleted successfully.' });
//         }

//         await existingProduct.save();
//         return res.status(200).send({ message: 'Product stock updated successfully', product: existingProduct });
//       } else {
//         return res.status(400).send({ message: 'Product stock is already at zero.' });
//       }
//     } else {
//       // If no product exists with the given barcode and userId
//       return res.status(404).send({ message: 'Product not found.' });
//     }
//   } catch (error) {
//     console.error('Error saving/updating product:', error);

//     // Handling duplicate key error specifically
//     if (error.code === 11000) {
//       res.status(400).send({ message: 'Product already exists for this user.' });
//     } else {
//       res.status(500).send({ message: 'An error occurred while saving/updating the product.' });
//     }
//   }
// });
app.post("/api/delete/products", async (req, res) => {
  try {
    const { barcode, userId } = req.body;

    // Validate input
    if (!barcode || !userId) {
      return res
        .status(400)
        .send({ message: "Barcode and userId are required." });
    }

    // Find the product for the given userId and barcode
    const existingProduct = await Product.findOne({ userId, barcode });
    if (existingProduct) {
      // Check if current stock is greater than 0
      if (existingProduct.currentStock > 0) {
        existingProduct.currentStock -= 1; // Decrease the stock by 1

        // If stock reaches 0, delete the product and send email alert
        if (existingProduct.currentStock === 0) {
          // Fetch user's email (assuming you have a User model with email)
          const user = await User.findById(userId); // Replace with actual user fetch logic
          if (user) {
            await sendEmailAlert(user.email, existingProduct);
          }

          // Delete the product
          await Product.deleteOne({ userId, barcode });
          return res
            .status(200)
            .send({
              message: "Product deleted successfully, and email alert sent.",
            });
        }

        await existingProduct.save();
        return res.status(200).send({
          message: "Product stock updated successfully",
          product: existingProduct,
        });
      } else {
        return res
          .status(400)
          .send({ message: "Product stock is already at zero." });
      }
    } else {
      // If no product exists with the given barcode and userId
      return res.status(404).send({ message: "Product not found." });
    }
  } catch (error) {
    console.error("Error saving/updating product:", error);

    // Handling duplicate key error specifically
    if (error.code === 11000) {
      res
        .status(400)
        .send({ message: "Product already exists for this user." });
    } else {
      res.status(500).send({
        message: "An error occurred while saving/updating the product.",
      });
    }
  }
});
// GET route to fetch all products for a specific user
app.get("/api/products/user-products", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }
    const products = await Product.find({ userId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

// DELETE route to delete a product by ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const deletedProduct = await Product.findOneAndDelete({ _id: id, userId });
    if (deletedProduct) {
      res.status(200).send({ message: "Product deleted successfully" });
    } else {
      res
        .status(404)
        .send({
          message:
            "Product not found or you don't have permission to delete it",
        });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
});

// Base route for testing the server
app.get("/", (req, res) => {
  res.send("<h1>Welcome to HomeCart Inventory Management</h1>");
});

// Server port configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
