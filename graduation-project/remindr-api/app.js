/**
  * @description This is the main file that loads all the necessary components
  * to make the app work.
  *
  * @see https://github.com/elbuki/remindr-api
*/
'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

require('./config/database');

// Declare routes
require('./modules/index.js')(app);

app.listen(process.env.PORT || 3000, 'localhost', function onInitialize() {
    
    const serverInfo = this.address();
    const address = serverInfo.address;
    const port = serverInfo.port;
    
    console.log(`remindr API running on: http://${address}:${port}`);
});
