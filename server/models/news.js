const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = mongoose.Schema({
    title:{
        required: true,
        type: String,
        unique: 1,
        maxlength:100
    },
    subtitle:{
        required: true,
        type: String,
        //unique: 1,
        maxlength:200
    },
    content:{
        required: true,
        type: String,
        maxlength:100000
    },
    seccion:{
        type: Schema.Types.ObjectId,
        ref: 'Seccion',
        required: true
    },
    tag:{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        //required: true
    },
    publish:{
        required: true,
        type: Boolean
    },
    images:{
        type: Array,
        default:[]
    }
},{timestamps:true});

const News = mongoose.model('News',newsSchema);
module.exports = { News }