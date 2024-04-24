const mongoose = require('mongoose')

const { Schema } = mongoose;

const unitSchema = new Schema({
    unit:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('unit',unitSchema)