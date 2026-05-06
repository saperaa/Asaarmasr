const express = require("express");
const Order = require("../models/Order");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const ADMIN_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const SHIPPER_TRANSITIONS = {
  pending: ["cancelled"],
  processing: ["cancelled"],
  shipped: ["cancelled"],
  delivered: [],
  cancelled: [],
};

router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const allowed =
      req.user.role === "admin"
        ? ADMIN_TRANSITIONS[order.status]
        : SHIPPER_TRANSITIONS[order.status];

    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({ message: `Cannot transition from '${order.status}' to '${status}'.` });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status." });
  }
});

module.exports = router;