'use strict';

/**
 * @param {{name: string, version: string}} packageData
 * @param {{defaults: function}} requestLib
 */
module.exports = function getRequestWrapper(packageData, requestLib) {
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
  return requestLib.defaults({
    headers: {
      'User-Agent': userAgent
    },
    json: true
  });
};
