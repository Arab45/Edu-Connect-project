const mongoose = require('mongoose');
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Notification', notificationSchema);