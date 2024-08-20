const express = require("express");
const {AddURLValidationMW, UpdateURLValidationMW} = require("../validators/URL.validator");
const URLModel = require("../models/URLs");

const URLRouter = express.Router();

// A simple function to generate a short ID (if not provided)
const crypto = require("crypto");

function generateShortURL(originalURL, customID = null) {
	// Validate the original URL
	if (typeof originalURL !== "string" || originalURL.length < 10) {
		return "Original URL must be a string of at least 10 characters";
	}

	// Check if a custom ID is provided and validate it
	if (
		customID &&
		(typeof customID !== "string" ||
			customID.length < 3 ||
			customID.length > 15)
	) {
		return "Custom ID must be a string between 3 and 15 characters";
	}

	// Generate a short URL using a custom ID or a unique hash
	const shortURL = customID ? customID : generateUniqueID();

	return {
		original: originalURL,
		short: shortURL,
	};
}

function generateShortURL(originalURL, customID = null) {
    if (typeof originalURL !== "string" || originalURL.length < 10) {
        throw new Error('Original URL must be a string of at least 10 characters');
    }

    const shortURL = customID ? customID : generateUniqueID();
    return {
        original: originalURL,
        short: shortURL,
    };
}


// GET all shortened URLs
URLRouter.get("/", async (req, res) => {
	try {
		console.log(1);
		const urls = await URLModel.find(); // Changed from URL to URLModel
		res.status(200).json(urls);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error });
	}
});

// POST a new shortened URL
URLRouter.post('/', AddURLValidationMW, async (req, res) => {
    const { original, customID } = req.body;

    try {
        // Generate the short URL data (using custom ID if provided)
        const shortURLData = generateShortURL(original, customID);

        // Assign the generated short URL to the request body
        req.body.short = shortURLData.short;

        // Create a new URLModel instance with the full payload (original and short URLs)
        const newURL = new URLModel(req.body);

        // Save the new URL to the database
        await newURL.save();

        // Respond with the saved URL data
        res.status(201).json(newURL);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bad Request", error: error.message });
    }
});




// DELETE a shortened URL by ID
URLRouter.delete("/:id", async (req, res) => {
	try {
		const url = await URLModel.findByIdAndDelete(req.params.id); // Changed from URL to URLModel
		if (!url) {
			return res.status(404).json({ message: "URL not found" });
		}
		res.status(200).json({ message: "URL deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error });
	}
});

// GET a shortened URL by ID
URLRouter.get("/:id", async (req, res) => {
	try {
		const url = await URLModel.findById(req.params.id); // Changed from URL to URLModel
		if (!url) {
			return res.status(404).json({ message: "URL not found" });
		}
		res.status(200).json(url);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error });
	}
});

// GET a shortened URL by ID
URLRouter.put("/:id", UpdateURLValidationMW, async (req, res) => {
	try {
		const id = await URLModel.findById(req.params.id);
        const url = req.body; // Changed from URL to URLModel
		if (!url) {
			return res.status(404).json({ message: "URL not found" });
		}
		res.status(200).json(url);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error });
	}
});



module.exports = URLRouter;
