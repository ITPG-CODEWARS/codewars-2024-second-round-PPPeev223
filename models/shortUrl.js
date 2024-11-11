const mongoose = require('mongoose')
const shortid = require('shortid')

const shortUrlSchema = new mongoose.Schema({
    full_url:{
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        default: shortid.generate
    },
    url_clicks: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)