const express = require("express");
const router = express.Router();
const Gig = require("../model/gigs");
const auth = require("../middleware/auth");

// CREATE GIG
router.post("/", auth, async (req, res) => {
    const gig = new Gig({ ...req.body, postedBy: req.user.id });
    try {
        const savedGig = await gig.save();
        res.status(201).json(savedGig);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL GIGS (with optional filters)
router.get("/", async (req, res) => {
    const qCategory = req.query.category;
    try {
        let gigs;
        if (qCategory) {
            gigs = await Gig.find({ category: qCategory }).populate("postedBy", "username avatar");
        } else {
            gigs = await Gig.find().populate("postedBy", "username avatar");
        }
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET SINGLE GIG
router.get("/:id", async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate("postedBy", "username avatar");
        res.status(200).json(gig);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE GIG
router.put("/:id", auth, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (gig.postedBy.toString() === req.user.id) {
            const updatedGig = await Gig.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updatedGig);
        } else {
            res.status(401).json("You can only update your gig");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE GIG
router.delete("/:id", auth, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (gig.postedBy.toString() === req.user.id) {
            await gig.deleteOne();
            res.status(200).json("Gig has been deleted");
        } else {
            res.status(401).json("You can only delete your gig");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
