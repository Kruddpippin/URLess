const express = require("express");
const URLValidationMW = require("../validators/URL.validator");
const URLModel = require("../models/URLs");
const shortUrlService = require('./shortUrlService/shortUrlService');

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

function generateUniqueID() {
	return crypto.randomBytes(4).toString("hex"); // Generates an 8-character hexadecimal string
}

// GET all shortened URLs
URLRouter.get("/", async (req, res) => {
	try {
		const urls = await URLModel.find();
		res.status(200).json(urls);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error });
	}
});

// POST a new shortened URL
URLRouter.post('/shorten', URLValidationMW, (req, res) => {
	const originalURL = req.body.originalURL;
	shortUrlService.generateAndSaveShortURL(originalURL)
	  .then((shortURL) => {
		res.json({ shortURL });
	  })
	  .catch((err) => {
		res.status(500).json({ error: 'Failed to generate short URL' });
	  });
  });
// DELETE a shortened URL by ID
URLRouter.delete("/:id", async (req, res) => {
	try {
		const url = await URLModel.findByIdAndDelete(req.params.id);
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
		const url = await URLModel.findById(req.params.id);
		if (!url) {
			return res.status(404).json({ message: "URL not found" });
		}
		res.status(200).json(url);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error });
	}
});

module.exports = URLRouter;
