'use strict';

const getBinary = document => {

  const options = {
    type: 'nodebuffer',
  };
  const zip = document.getZip();
  const output = zip.generate(options);
  const binary = output.toString('base64');

  return Promise.resolve(binary);
};

module.exports = getBinary;
