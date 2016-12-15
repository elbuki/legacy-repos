// User model

'use strict';

const mongoose = require('mongoose');
const comparePassword = require('../helpers/compare-password');

let emailValidator = function(email) {

    return /^[a-zA-Z0-9_.+-]+@(est.)?utn.ac.cr+$/.test(email);
};

let schema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
        validate: {
            validator: emailValidator,
            message: '{VALUE} is not a UTN valid email!'
        }
    },
    password_digest: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200
    }

});

schema.methods.comparePassword = function(candidatePassword, callback) {

    comparePassword(candidatePassword, this.password_digest, (error, isMatch) => {
        if (error) {
            return callback(error);
        }

        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', schema);
