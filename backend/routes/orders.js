const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const Gig = require("../model/gigs");
const auth = require("../middleware/auth");

// CREATE ORDER (Simulate Booking)
router.post("/:gigId", auth, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return res.status(404).json("Gig not found");

        const newOrder = new Order({
            gigId: gig._id,
            img: gig.image,
            title: gig.title,
            price: gig.price,
            buyerId: req.user.id,
            sellerId: gig.postedBy,
            isCompleted: false
        });

        await newOrder.save();
        res.status(200).json(newOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }]
        }).populate("buyerId sellerId", "username email");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// MARK COMPLETED (To allow review)
router.put("/:id/complete", auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order.buyerId.toString() !== req.user.id && order.sellerId.toString() !== req.user.id) {
            return res.status(401).json("Unauthorized");
        }
        order.isCompleted = true;
        await order.save();
        res.status(200).json("Order completed");
    } catch (err) {
        res.status(500).json(err);
    }
});

// CHECK IF COMPLETED ORDER EXISTS FOR GIG AND USER
router.get("/check/:gigId", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            gigId: req.params.gigId,
            buyerId: req.user.id,
            isCompleted: true
        });
        res.status(200).json({ canReview: !!order });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
