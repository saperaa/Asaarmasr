const mongoose = require("mongoose");

const CrmUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["admin", "shipper"], required: true },
}, { timestamps: { createdAt: "created_at" } });

CrmUserSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password_hash;
  },
});

module.exports = mongoose.models.CrmUser || mongoose.model("CrmUser", CrmUserSchema);