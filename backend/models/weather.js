const mongoose = require('mongoose')

const { Schema } = mongoose;

const weatherSchema = new Schema({
    date:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    units:{
        type: String,
        required: true
    },
    tz: String,
    units: String,
    cloud_cover: {
        afternoon: Number
    },
    humidity: {
        afternoon: Number
    },
    precipitation: {
        total: Number
    },
    temperature: {
        min: Number,
        max: Number,
        afternoon: Number,
        night: Number,
        evening: Number,
        morning: Number
    },
    pressure: {
        afternoon: Number
    },
    wind: {
    max: {
        speed: Number,
        direction: Number
    }
    }
});

module.exports = mongoose.model('weather',weatherSchema)