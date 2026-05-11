const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  summary:    { type: String, required: true, trim: true },
  content:    { type: String, required: true, trim: true },
  category:   { type: String, default: "Market Analysis", trim: true },
  author:     { type: String, default: "Asaar Masr Team", trim: true },
  read_time:  { type: String, default: "5 min", trim: true },
  image_url:  { type: String, default: "" },
  trend:      { type: String, enum: ["up", "neutral", "down"], default: "neutral" },
  published:  { type: Boolean, default: true },
}, { timestamps: { createdAt: "created_at" } });

BlogPostSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id       = ret._id.toString();
    ret.createdAt = ret.created_at;
    ret.readTime  = ret.read_time;
    ret.imageUrl  = ret.image_url;
    delete ret._id;
    delete ret.__v;
    delete ret.created_at;
    delete ret.updatedAt;
    delete ret.read_time;
    delete ret.image_url;
  },
});

module.exports = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
