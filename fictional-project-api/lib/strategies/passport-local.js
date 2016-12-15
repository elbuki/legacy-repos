
'use strict';

const localStrategy = require('passport-local').Strategy;

let User = require('../../user/user');

module.exports = function(passport) {

    let customFields = {
        usernameField: 'email'
    };

    let errorMessage = 'Incorrect login credentials';

    passport.use(new localStrategy(customFields,
                    function(email, password, done) {
                        User.findOne({
                            email: email
                        }, function(error, user) {

                            if(error) {

                                return done(error);
                            }

                            if(!user) {

                                return done(null, false, errorMessage);
                            }

                            user.comparePassword(password,
                                            (error, matches) => {

                                                if(error) {
                                                    return done(error);
                                                }

                                                if(!matches) {
                                                    return done(null, false,
                                                        errorMessage);
                                                } else {
                                                    return done(null, user);
                                                }
                                            });
                        });
                    }));
};
