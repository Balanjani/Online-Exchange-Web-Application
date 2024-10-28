const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bidDateOpen: {
    type: String,
    required: false,
  },
  bidDateClose: {
    type: String,
    required: false,
  },
  bidConfirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  quantity: {
    type: Number,
    required: false,
    default: 1,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  manufacturer: {
    type: String,
  },
  // available: {
  //   type: Boolean,
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
