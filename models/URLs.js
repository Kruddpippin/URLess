const mongoose = require('mongoose')

//define schema
const Schema = mongoose.Schema;

//define URL schema
const URLSchema = new Schema({
    original: String,
    short: String,
    clicks: {type: Number, default: 0},
    date: {type: Date, default: Date.now},
    customID: String,
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})


module.exports ={ URLSchema}