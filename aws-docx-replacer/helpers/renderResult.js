'use strict';

const renderResult = document => {

  return new Promise((resolve, reject) => {

    try {

      document.render();

      resolve(document);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = renderResult;
