const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// UPLOAD ENDPOINT
router.post("/", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json("No file uploaded");
        }
        // Return the path that will be stored in DB
        res.status(200).json(`/uploads/${req.file.filename}`);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

module.exports = router;
