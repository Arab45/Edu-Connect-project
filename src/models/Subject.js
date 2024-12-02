const mongoose = require('mongoose');
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Subject', subjectSchema);