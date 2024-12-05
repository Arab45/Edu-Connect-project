const mongoose = require('mongoose');
const Schema = mongoose.Schema

const answerSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    questionId: { 
        type: String, 
        ref: 'Question', 
        required: true 
    },
    body: {
        type: String,
        minlength: 10,
        required: true
    },
    diagram_image: {
        type: String
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

module.exports = mongoose.model('Answer', answerSchema);