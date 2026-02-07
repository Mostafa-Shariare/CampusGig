const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const auth = require("../middleware/auth");

// CREATE POST
router.post("/", auth, async (req, res) => {
    const post = new Post({ ...req.body, postedBy: req.user.id });
    try {
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate("postedBy", "username avatar");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET SINGLE POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("postedBy", "username avatar");
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE POST
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.postedBy.toString() === req.user.id) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        } else {
            res.status(401).json("You can only delete your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
