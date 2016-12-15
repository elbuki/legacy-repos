/**
 * @description This is the main file that loads all the necessary components
 * to make the app work.
 *
 * @see https://github.com/elbuki/blog-api
 */

'use strict';

const restify = require('restify');
const server = restify.createServer();

require('dotenv').config();

require('./config/database');

server.use(restify.bodyParser());
server.use(restify.queryParser());

require('./routes/posts')(server);

server.listen(process.env.PORT_NUMBER || 8080, 'localhost', function() {
    let address = this.address();
    console.log('Server running at http://' + address.address + ':' + address.port);
});
