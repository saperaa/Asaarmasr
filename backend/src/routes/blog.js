const express = require("express");
const BlogPost = require("../models/BlogPost");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const posts = await BlogPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Failed to fetch blog posts." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, summary, content, category, author, read_time, image_url, trend, published } = req.body;
    if (!title || !summary || !content) {
      return res.status(400).json({ message: "title, summary, and content are required." });
    }
    const post = await BlogPost.create({
      title, summary, content,
      category:  category   || "Market Analysis",
      author:    author     || "Asaar Masr Team",
      read_time: read_time  || "5 min",
      image_url: image_url  || "",
      trend:     trend      || "neutral",
      published: published  !== undefined ? published : true,
    });
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: "Failed to create blog post." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found." });
    const { title, summary, content, category, author, read_time, image_url, trend, published } = req.body;
    Object.assign(post, {
      title:     title     ?? post.title,
      summary:   summary   ?? post.summary,
      content:   content   ?? post.content,
      category:  category  ?? post.category,
      author:    author    ?? post.author,
      read_time: read_time ?? post.read_time,
      image_url: image_url !== undefined ? image_url : post.image_url,
      trend:     trend     ?? post.trend,
      published: published !== undefined ? published : post.published,
    });
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: "Failed to update blog post." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found." });
    await BlogPost.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch {
    res.status(500).json({ message: "Failed to delete blog post." });
  }
});

module.exports = router;
