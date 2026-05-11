const express = require("express");
const Store = require("../models/Store");
const Order = require("../models/Order");
const Product = require("../models/Product");
const BlogPost = require("../models/BlogPost");

const router = express.Router();

// GET /api/public/products
router.get("/products", async (_req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ created_at: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

router.get("/stores", async (_req, res) => {
  try {
    const stores = await Store.find({ active: true }).sort({ created_at: 1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stores." });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const {
      customerName, customerEmail, product, quantity, totalEGP, storeId,
      shippingAddress, shippingCity, shippingPhone, shippingNotes,
    } = req.body;

    if (!customerName || !customerEmail || !product || !quantity || !totalEGP || !storeId) {
      return res.status(400).json({ message: "All order fields are required." });
    }
    if (!shippingAddress || !shippingCity || !shippingPhone) {
      return res.status(400).json({ message: "Shipping address, city, and phone are required." });
    }

    const order = await Order.create({
      customer_name:    customerName,
      customer_email:   customerEmail,
      product,
      quantity,
      total_egp:        totalEGP,
      status:           "pending",
      store_id:         storeId,
      shipping_address: shippingAddress,
      shipping_city:    shippingCity,
      shipping_phone:   shippingPhone,
      shipping_notes:   shippingNotes || "",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order." });
  }
});

router.get("/blog", async (_req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).sort({ created_at: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch blog posts." });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, published: true });
    if (!post) return res.status(404).json({ message: "Article not found." });
    res.json(post);
  } catch {
    res.status(404).json({ message: "Article not found." });
  }
});

module.exports = router;