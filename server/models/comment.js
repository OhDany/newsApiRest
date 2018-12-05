const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    text:{
        type: String,
        maxlength: 1000
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    }
},{timestamps:true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }