'use strict';

const setValues = (document, params) => {
  return Promise.resolve(document.setData(params));
};

module.exports = setValues;
