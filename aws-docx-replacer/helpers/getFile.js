'use strict';

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const getFile = key => {

  const params = {
		Bucket: process.env.S3_BUCKET,
		Key: key,
	};

  return new Promise((resolve, reject) => {

    s3.getObject(params, (error, data) => {

      if (error) {
        return reject(error);
      }

      resolve(data.Body);
    });
  });
};

module.exports = getFile;
