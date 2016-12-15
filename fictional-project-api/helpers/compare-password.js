/**
 * Helper that compares a password stored in the database with any password
    that the user entered.
 * It takes three parameters:
 *     candidatePassword: Password that is stored in the database.
 *     userPassword: Password that the user entered in the login form.
 *     callback: Function that executes when the comparasion is complete.
 */
'use strict';

const bcrypt = require('bcrypt');

module.exports = (candidatePassword, userPassword, callback) =>
                    bcrypt.compare(candidatePassword, userPassword, callback);
