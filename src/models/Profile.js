const mongoose = require('mongoose');
const Schema = mongoose.Schema

const profileSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Profile', profileSchema);