const mongoose = require('mongoose');

const seccionSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
        unique: 1,
        maxlength: 100
    }
});

const Seccion = mongoose.model('Seccion',seccionSchema);

module.exports = { Seccion }