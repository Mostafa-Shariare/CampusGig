const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    cover: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    bio: {
        type: String,
        default: "I am a student"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    gigs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig"
    }],
    savedGigs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gig"
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    notifications: {
        type: Array, // Keeping general array for now as structure isn't defined, but could be ref'd later
        default: []
    },
    messages: {
        type: Array, // Keeping general array for now
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("User", user);