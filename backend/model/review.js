const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig",
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    desc: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
