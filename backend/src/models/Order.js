const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer_name: { type: String, required: true, trim: true },
  customer_email: { type: String, required: true, trim: true },
  product: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  total_egp: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
}, { timestamps: { createdAt: "created_at" } });

OrderSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    ret.customerName = ret.customer_name;
    ret.customerEmail = ret.customer_email;
    ret.totalEGP = ret.total_egp;
    ret.storeId = ret.store_id;
    ret.createdAt = ret.created_at;
    delete ret._id;
    delete ret.__v;
    delete ret.customer_name;
    delete ret.customer_email;
    delete ret.total_egp;
    delete ret.store_id;
    delete ret.created_at;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);