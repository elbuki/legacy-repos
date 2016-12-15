// Survey model

'use strict';

const mongoose = require('mongoose');

const Question = require('./question');

let schema = mongoose.Schema({

    questions: {
        any: {}
    }
});

module.exports = mongoose.model('Survey', schema);
