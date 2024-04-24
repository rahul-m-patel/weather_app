const mongoose = require('mongoose')

const { Schema } = mongoose;

const locationSchema = new Schema({
    city:{
        type: String,
        required: true
    },
    lat:{
        type: String,
        required: true
    },
    lon:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('location',locationSchema)