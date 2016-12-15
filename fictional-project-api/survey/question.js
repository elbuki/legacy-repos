// Question model

'use strict';

const mongoose = require('mongoose');

const Answer = require('./answer');

let schema = mongoose.Schema({

    question: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140
    },
    multiple: {
        type: Boolean,
        default: false
    },
    answers: {
        any: {}
    }

});

module.exports = mongoose.model('Question', schema);
