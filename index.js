'use strict';
const request = require('request-promise');

/**
 * @param {{name: string, version: string}} packageData
 */
module.exports = function getRequestWrapper(packageData) {
  if (!packageData) {
    throw new Error('Package is required');
  }
  const { name, version } = packageData;
  if (!name || !version) {
    throw new Error(
      `Invalid package data: ${JSON.stringify({ name, version })}`
    );
  }
  const userAgent = `${name}/${version} node.js/${process.version}`;
  return request.defaults({
    headers: {
      'User-Agent': userAgent
    },
    json: true
  });
};
