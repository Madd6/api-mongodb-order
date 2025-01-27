const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Order = require("./models/Order");
require("dotenv").config();

const app = express();
app.use(express.json());
let corsOption = {
  origin: "*",
  optionSuccessStatus: 200,
  methods: "GET, POST"
}
app.use(cors(corsOption));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- API Endpoints ---

// Create Order
app.post("/orders", async (req, res) => {
  try {
    const { orderId , products, totalPrice } = req.body;
    console.log(orderId,products, totalPrice)
    const order = new Order({
      orderId,
      products,
      totalPrice,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Order by ID
app.get("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
app.patch("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: { status: req.body.status } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Order
app.delete("/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;