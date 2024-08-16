const express = require('express');
const URLValidationMW = require('../validators/URL.validator');
const URLModel = require('../models/URLs');

const URLRouter = express.Router();

// A simple function to generate a short ID (if not provided)
function generateShortID() {
    return Math.random().toString(36).substr(2, 8);
}

// GET all shortened URLs
URLRouter.get('/', async (req, res) => {
    try {
        const urls = await URLModel.find();  // Changed from URL to URLModel
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// POST a new shortened URL
URLRouter.post('/', URLValidationMW, async (req, res) => {
    const { original, customID } = req.body;
    
    try {
        const newURL = new URLModel({ original, short: customID || generateShortID() });  // Changed from URL to URLModel
        await newURL.save();
        res.status(201).json(newURL);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
    }
});

// DELETE a shortened URL by ID
URLRouter.delete('/:id', async (req, res) => {
    try {
        const url = await URLModel.findByIdAndDelete(req.params.id);  // Changed from URL to URLModel
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// GET a shortened URL by ID
URLRouter.get('/:id', async (req, res) => {
    try {
        const url = await URLModel.findById(req.params.id);  // Changed from URL to URLModel
        if (!url) {
            return res.status(404).json({ message: 'URL not found' });
        }
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = URLRouter;
