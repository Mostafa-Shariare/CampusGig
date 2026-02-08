const express = require("express");
const router = express.Router();
const Review = require("../model/review");
const Order = require("../model/order");
const Gig = require("../model/gigs");
const auth = require("../middleware/auth");

// CREATE REVIEW
router.post("/", auth, async (req, res) => {
    try {
        const { gigId, star, desc } = req.body;

        // 1. Check if user ordered and completed the gig
        const hasPurchased = await Order.findOne({
            gigId: gigId,
            buyerId: req.user.id,
            isCompleted: true
        });

        if (!hasPurchased) {
            return res.status(403).json("You must purchase and complete the gig to leave a review.");
        }

        // 2. Check if already reviewed
        const existingReview = await Review.findOne({
            gigId: gigId,
            reviewerId: req.user.id
        });

        if (existingReview) {
            return res.status(403).json("You have already reviewed this gig.");
        }

        const newReview = new Review({
            gigId,
            reviewerId: req.user.id,
            star,
            desc
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET REVIEWS FOR GIG
router.get("/:gigId", async (req, res) => {
    try {
        const reviews = await Review.find({ gigId: req.params.gigId })
            .populate("reviewerId", "username avatar")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE REVIEW
router.delete("/:id", auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review.reviewerId.toString() === req.user.id) {
            await review.deleteOne();
            res.status(200).json("Review deleted");
        } else {
            res.status(403).json("You can only delete your own review");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
