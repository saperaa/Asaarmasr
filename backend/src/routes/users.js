const express = require("express");
const CrmUser = require("../models/CrmUser");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function safeUser(doc) {
  return { id: doc.id, name: doc.name, email: doc.email, role: doc.role };
}

router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await CrmUser.find().sort({ created_at: 1 });
    res.json(users.map(safeUser));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password, and role are required." });
    }
    if (!["admin", "shipper"].includes(role)) {
      return res.status(400).json({ message: "role must be 'admin' or 'shipper'." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await CrmUser.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already exists." });

    const bcrypt = require("bcryptjs");
    const hash = bcrypt.hashSync(password, 10);
    const user = await CrmUser.create({ name: name.trim(), email: email.trim().toLowerCase(), password_hash: hash, role });
    res.status(201).json(safeUser(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to create user." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const existing = await CrmUser.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "User not found." });

    await CrmUser.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user." });
  }
});

module.exports = router;