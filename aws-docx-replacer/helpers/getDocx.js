'use strict';

const Docxtemplater = require('docxtemplater');
const JSZip = new require('jszip');

const getDocx = binary => {

  return new Promise((resolve) => {

    const doc = new Docxtemplater();
    const zip = new JSZip(binary);

    resolve(doc.loadZip(zip));
  });
};

module.exports = getDocx;
