'use strict';

const getFile = require('./helpers/getFile');
const getDocx = require('./helpers/getDocx');
const setValues = require('./helpers/setValues');
const renderResult = require('./helpers/renderResult');
const getBinary = require('./helpers/getBinary');
const sendResponse = require('./helpers/sendResponse');
const errorHandler = require('./helpers/errorHandler');

// Params coming from AccessDS
const fileName = 'test.docx';
const testParams = {
  first_name: 'Brian',
};

require('./config/aws');

getFile(fileName)
  .then(getDocx)
  .then(document => setValues(document, testParams))
  .then(renderResult)
  .then(getBinary)
  .then(sendResponse)
  .catch(errorHandler);
