const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/products
router.get("/", requireAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

// POST /api/products
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name_en, name_ar, karat, description_en, description_ar, imageUrl, active } = req.body;
    if (!name_en || !name_ar || !karat) {
      return res.status(400).json({ message: "name_en, name_ar, and karat are required." });
    }
    const product = await Product.create({
      name_en, name_ar, karat,
      description_en: description_en || "",
      description_ar: description_ar || "",
      image_url: imageUrl || "",
      active: active !== undefined ? active : true,
    });
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Failed to create product." });
  }
});

// PUT /api/products/:id
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const { name_en, name_ar, karat, description_en, description_ar, imageUrl, active } = req.body;
    Object.assign(product, {
      name_en:        name_en        ?? product.name_en,
      name_ar:        name_ar        ?? product.name_ar,
      karat:          karat          ?? product.karat,
      description_en: description_en ?? product.description_en,
      description_ar: description_ar ?? product.description_ar,
      image_url:      imageUrl !== undefined ? imageUrl : product.image_url,
      active:         active   !== undefined ? active   : product.active,
    });
    await product.save();
    res.json(product);
  } catch {
    res.status(500).json({ message: "Failed to update product." });
  }
});

// DELETE /api/products/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    await Product.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch {
    res.status(500).json({ message: "Failed to delete product." });
  }
});

module.exports = router;
