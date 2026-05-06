const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, default: "", trim: true },
  address_en: { type: String, required: true, trim: true },
  address_ar: { type: String, default: "", trim: true },
  phone: { type: String, required: true, trim: true },
  city_en: { type: String, required: true, trim: true },
  city_ar: { type: String, default: "", trim: true },
  image_url: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at" } });

StoreSchema.set("toJSON", {
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

module.exports = mongoose.models.Store || mongoose.model("Store", StoreSchema);