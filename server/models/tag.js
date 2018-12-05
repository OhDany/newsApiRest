const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = { Tag }