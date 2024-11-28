const mongoose = require('mongoose');
const Schema = mongoose.Schema

const questionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        maxlength: 255,
        required: true
    },
    body: {
        type: String,
        minlength: 10,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updateAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Question', questionSchema);