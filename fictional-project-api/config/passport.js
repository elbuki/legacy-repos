/**
 * Manage social network accounts with PassportJS
 * @see  http://passportjs.org/docs/overview
 */
'use strict';

const passport = require('passport');

module.exports = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
