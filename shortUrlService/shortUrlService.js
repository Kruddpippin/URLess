const mongoose = require('mongoose');
const shortUrlModel = require('./shortUrlModel'); // assuming your model is in the same directory
const randomstring = require('randomstring');

async function generateAndSaveShortURL(originalURL) {
  const shortCode = randomstring.generate(6);
  const shortURL = `https://yourdomain.com/${shortCode}`;
  const shortUrlDoc = new shortUrlModel({ original: originalURL, shortUrl: shortURL });
  try {
    const result = await shortUrlDoc.save();
    return shortURL;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { generateAndSaveShortURL };