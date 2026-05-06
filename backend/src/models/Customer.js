const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
}, { timestamps: { createdAt: "created_at" } });

CustomerSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
    delete ret.created_at;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);