'use strict';

const _ = require('lodash');

const ApiUtils = {
  pickErrorData({ it, includedRequestData = ['url', 'baseUrl', 'method'] }) {
    let error = it.error;
    
    if (it.error.response) {
      error = {
        ..._.pick(it.error.response, [
          'statusCode', 'statusMessage', 'body',
        ])
      };
    } 
    
    error.request = _.pick(it.finalConfig, includedRequestData);

    return error;
  }
};

module.exports = { ApiUtils };