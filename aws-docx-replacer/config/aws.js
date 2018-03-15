'use strict';

const AWS = require('aws-sdk');

const awsOptions = {
	accessKeyId: process.env.AWS_AKI,
	secretAccessKey: process.env.AWS_SAK,
	region: process.env.AWS_REGION,
};

AWS.config.update(awsOptions);
