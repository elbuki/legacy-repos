// Answer model

'use strict';

const mongoose = require('mongoose');

let schema = mongoose.Schema({

    answer: {
        type: String,
        required: true,
        maxlength: 70
    },
    pickedCount: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model('Answer', schema);
