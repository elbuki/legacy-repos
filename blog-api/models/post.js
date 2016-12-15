'use strict';

const mongoose = require('mongoose');

let schema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        maxlength: 25
    },

    body: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 1000
    },

    location: {
        formattedAddress: {
            type: String
        },

        latitude: {
            type: Number
        },

        longitude: {
            type: Number
        }
    },

    tags: [{
        type: String,
        minlength: 5,
        maxlength: 25
    }],

    comments: [{
        commenterName: {
            type: String,
            minlength: 5,
            maxlength: 15,
            default: 'anonymous'
        },
        body: {
            type: String,
            required: true,
            maxlength: 140
        },
        replies: [{}],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Post', schema);
