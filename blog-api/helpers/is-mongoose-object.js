'use strict';

const mongoose = require('mongoose');

module.exports = value => mongoose.Types.ObjectId.isValid(value);
