const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  products: [
    {
      idCart: { type: String, required: true }, // Added idCart
      id: { type: String, required: true }, // Matches product_id in your schema
      name: { type: String, required: true },
      image: { type: String, required: true }, // Added image
      amount: { type: Number, required: true }, // Matches quantity in your schema
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);