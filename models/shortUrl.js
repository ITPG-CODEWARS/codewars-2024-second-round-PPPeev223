const mongoose = require('mongoose');
const shortid = require('shortid');

// Define the schema for short URLs
const shortUrlSchema = new mongoose.Schema({
    full_url: {
        type: String,
        required: true,
    },
    short_url: {
        type: String,
        required: true,
        default: shortid.generate,  // Generates a unique short ID
    },
    url_clicks: {
        type: Number,
        required: true,
        default: 0,  // Initializes the click count to 0
    },
});

// Create the model from the schema
module.exports = mongoose.model('shortUrl', shortUrlSchema);
