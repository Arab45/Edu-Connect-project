const mongoose = require('mongoose');
const Schema =mongoose.Schema

const userVoteSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    voteValue: [{
        upVote: {
            type: Number
        },
        downVote: {
            type: Number
        }
}],
createdAt: {
    type: Date,
    default: Date.now()
}
});


module.exports = mongoose.model('Vote', userVoteSchema);