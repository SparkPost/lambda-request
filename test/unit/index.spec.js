'use strict';

const chai = require('chai');
const random = require('lodash.random');

const expect = chai.expect;

describe('lambda request', function() {
  let module, name, version, mockRequest;
  beforeEach(function() {
    name = `name${random(1, 999999)}`;
    version = `${random(1, 999999)}.${random(1, 999999)}.${random(1, 999999)}`;
    mockRequest = {
      defaults: (args) => args
    };
    module = require('index.js');
  });

  it('should return a request thing with default options set', function() {
    const result = module({ name, version }, mockRequest);
    expect(result).to.deep.equal({
      headers: {
        'User-Agent': `${name}/${version} node.js/${process.version}`
      },
      json: true
    });
  });

  it('should throw an error if no package is passed', function() {
    expect(() => module(null, mockRequest)).to.throw('Package is required');
  });

  it('should throw an error if bad package is passed', function() {
    expect(() => module({ something: 'else' }, mockRequest)).to.throw(
      'Invalid package data'
    );
  });
});
