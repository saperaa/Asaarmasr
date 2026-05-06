const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const router = express.Router();

// GET /api/customer/me — restore session from stored token
router.get("/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    if (decoded.type !== "customer") {
      return res.status(401).json({ message: "Invalid token type." });
    }
    const customer = await Customer.findById(decoded.id);
    if (!customer) return res.status(404).json({ message: "User not found." });
    res.json({ user: { id: customer.id, name: customer.name, email: customer.email } });
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

function signToken(customer) {
  return jwt.sign(
    { id: customer.id || customer._id.toString(), email: customer.email, type: "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const hash = bcrypt.hashSync(password, 10);
    const customer = await Customer.create({ name: name.trim(), email: email.trim().toLowerCase(), password_hash: hash });

    const token = signToken(customer);
    res.status(201).json({ token, user: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (!customer || !bcrypt.compareSync(password, customer.password_hash)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(customer);
    res.json({ token, user: { id: customer.id, name: customer.name, email: customer.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;