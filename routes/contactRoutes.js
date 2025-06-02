const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: "Message received successfully!" });
    } catch (err) {
        console.error("❌ Contact save error:", err);
        res.status(500).json({ message: "Failed to save message." });
    }
});

module.exports = router;
