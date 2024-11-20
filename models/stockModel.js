import mongoose from "mongoose";

const stockModel = new mongoose.Schema({
  title: { type: String, required: true }, // Product name
  brand: { type: String }, // Brand name
  category: { type: [String] }, // Category of item (e.g., eatables, hygiene)
  description: { type: String }, // Brief description of the product
  manufacturer: { type: String }, // Manufacturer's name
  ingredients: { type: [String] }, // List of ingredients (if applicable)
  nutritionFacts: { type: String }, // Key-value pairs for nutrition info (e.g., calories, protein)
  features: { type: [String] }, // Additional features (e.g., organic, scent-free)
  attributes: { type: Map, of: String }, // Custom attributes like weight, volume, etc.
  barcode: { type: String }, // Unique barcode/identifier
  images: { type: [String] }, // URLs for product images
  currentStock: { type: Number, required: true, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Current stock count

  createdAt: { type: Date, default: Date.now }, // Date of entry creation
});
stockModel.index({ barcode: 1, userId: 1 }, { unique: true });
export default mongoose.model("Product", stockModel);
//module.exports = mongoose.model('Product', stockModel);
