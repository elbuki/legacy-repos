'use strict';

const querystring = require('querystring');
const https = require('https');

const fileType = 'vnd.openxmlformats-officedocument.wordprocessingml.document';
const sendResponse = binary => {

  const formData = {
    document: binary,
  };
  const data = querystring.stringify(formData);
  const options = {
    host: process.env.ENDPOINT_HOST,
    port: 80,
    path: process.env.ENDPOINT_PATH,
    method: 'POST',
    headers: {
      'Content-Type': `application/${fileType}`,
      'Content-Length': Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {

    const request = https.request(options, response => {

      response.setEncoding('utf8');

      response.on('data', console.log);
    });

    request.on('error', reject);

    request.write(data);
    request.end();
  });
};

module.exports = sendResponse;
