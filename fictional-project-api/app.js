// Main file

'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

require('dotenv').config();
require('./config/database');

app.use(require('express-session')({
    name: 'sessions',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUnitialized: true
}));

app.use('/public', express.static(__dirname + '/public'));

require('./config/passport')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('cors')());

let surveys = require('./survey/index')(express);
let users = require('./user/index');

app.use('/', surveys);
app.use('/', users);

app.listen(process.env.PORT || 3000, 'localhost', function () {
    let address = this.address();
    console.log('Server listening at: http://' + address.address +
                ':' + address.port);
});
