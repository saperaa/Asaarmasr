const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CrmUser = require("../models/CrmUser");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function safeUser(doc) {
  return { id: doc.id, name: doc.name, email: doc.email, role: doc.role };
}

function signToken(user) {
  return jwt.sign(
    { id: user.id || user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await CrmUser.findOne({ email: email.trim().toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await CrmUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

module.exports = router;