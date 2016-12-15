
'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

let User = require('./user');

require('../lib/strategies/passport-local')(passport);

router.post('/login', passport.authenticate('local'), (request, response) => {

    let user = {
        name: request.user.name,
        _id: request.user._id
    };

    return response.json(user);
});

router.post('/user', (request, response) => {

    let newUser = new User(request.body);

    if(!request.body.password) {

        let errorObject = {
            code: 12
        };

        return response.status(422).json(errorObject);
    }

    bcrypt.hash(request.body.password, 8, (error, hashed) => {

        if(error) {
            return response.json(error);
        }

        newUser.password_digest = hashed;

        newUser.save().then((user) => {

            return response.json(user);
        }).catch((error) => {

            return response.status(422).json(error);
        });
    });

});

module.exports = router;
