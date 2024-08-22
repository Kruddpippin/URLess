const mongoose = require("mongoose");

//define schema
const Schema = mongoose.Schema;

//define URL schema
const URLSchema = new Schema({
	original: String,
	shortUrl: String,
	date: { type: Date, default: Date.now },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("shortUrl", URLSchema);