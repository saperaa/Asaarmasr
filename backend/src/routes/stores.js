const express = require("express");
const Store = require("../models/Store");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const stores = await Store.find().sort({ created_at: 1 });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stores." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name_en, name_ar, address_en, address_ar, phone, city_en, city_ar, imageUrl, active } = req.body;
    if (!name_en || !name_ar || !address_en || !city_en || !phone) {
      return res.status(400).json({ message: "name_en, name_ar, address_en, city_en, and phone are required." });
    }

    const store = await Store.create({
      name_en,
      name_ar: name_ar || "",
      address_en,
      address_ar: address_ar || "",
      phone,
      city_en,
      city_ar: city_ar || "",
      image_url: imageUrl || "",
      active: active !== undefined ? active : true,
    });

    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: "Failed to create store." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const existing = await Store.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Store not found." });

    const { name_en, name_ar, address_en, address_ar, phone, city_en, city_ar, imageUrl, active } = req.body;
    Object.assign(existing, {
      name_en: name_en ?? existing.name_en,
      name_ar: name_ar ?? existing.name_ar,
      address_en: address_en ?? existing.address_en,
      address_ar: address_ar ?? existing.address_ar,
      phone: phone ?? existing.phone,
      city_en: city_en ?? existing.city_en,
      city_ar: city_ar ?? existing.city_ar,
      image_url: imageUrl !== undefined ? imageUrl : existing.image_url,
      active: active !== undefined ? active : existing.active,
    });
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(500).json({ message: "Failed to update store." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const existing = await Store.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Store not found." });

    await Store.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete store." });
  }
});

module.exports = router;