const express = require("express");
const router = express.Router();
const Comment = require("../model/comment");
const Post = require("../model/post");
const auth = require("../middleware/auth");

// ADD COMMENT
router.post("/", auth, async (req, res) => {
    const newComment = new Comment(req.body);
    try {
        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id).populate("userId", "username avatar");
        res.status(200).json(populatedComment);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET COMMENTS
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .populate("userId", "username avatar") // Populate user details
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE COMMENT
router.delete("/:id", auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.userId.toString() === req.user.id) {
            await comment.deleteOne();
            res.status(200).json("Comment has been deleted");
        } else {
            res.status(401).json("You can only delete your comment");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
