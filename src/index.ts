import { CoreOptions } from 'request';

/**
 * @param {{name: string, version: string}} packageData
 * @param {{defaults: function}} requestLib
 */
export = function getRequestWrapper<T extends { defaults: (options: CoreOptions) => T }>(
  packageData: { name: string; version: string },
  requestLib: T
): T {
  if (!packageData) {
    throw new Error('Package is required');
  }
  const { name, version } = packageData;
  if (!name || !version) {
    throw new Error(`Invalid package data: ${JSON.stringify({ name, version })}`);
  }
  const userAgent = `${name}/${version} node.js/${process.version}`;
  return requestLib.defaults({
    headers: {
      'User-Agent': userAgent,
    },
    json: true,
  });
};
