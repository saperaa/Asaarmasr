const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, required: true, trim: true },
  karat: { type: String, enum: ["24K", "22K", "21K", "18K", "14K"], required: true },
  description_en: { type: String, default: "", trim: true },
  description_ar: { type: String, default: "", trim: true },
  image_url: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at" } });

ProductSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    ret.imageUrl = ret.image_url;
    ret.createdAt = ret.created_at;
    delete ret._id;
    delete ret.__v;
    delete ret.image_url;
    delete ret.created_at;
    delete ret.updatedAt;
  },
});

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
