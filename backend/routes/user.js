const express = require("express");
const router = express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE USER
router.put("/:id", auth, async (req, res) => {
    if (req.user.id !== req.params.id) {
        return res.status(401).json({ message: "You can only update your account" });
    }

    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true }).select("-password");
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

// FOLLOW USER
router.put("/follow/:id", auth, async (req, res) => {
    console.log("Follow request - req.user:", req.user);
    console.log("Follow request - target ID:", req.params.id);

    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!currentUser) {
                return res.status(404).json({ message: "Current user not found" });
            }

            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json({ message: "User has been followed" });
            } else {
                res.status(403).json({ message: "You already follow this user" });
            }
        } catch (error) {
            console.error("Follow error:", error);
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: "You cannot follow yourself" });
    }
});

// UNFOLLOW USER
router.put("/unfollow/:id", auth, async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!currentUser) {
                return res.status(404).json({ message: "Current user not found" });
            }

            if (user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json({ message: "User has been unfollowed" });
            } else {
                res.status(403).json({ message: "You don't follow this user" });
            }
        } catch (error) {
            console.error("Unfollow error:", error);
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: "You cannot unfollow yourself" });
    }
});

module.exports = router;