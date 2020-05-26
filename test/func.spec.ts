/* eslint-disable func-names */

import lambdaRequest from '../src/index';
import request from 'request';
import requestPromise from 'request-promise';
import nock, { ReplyFnContext } from 'nock';
import { expect } from 'chai';

// added this file just to make sure it works with typescript
describe('functional tests', function () {
  let requests: object[];

  beforeEach(function () {
    requests = [];
    // doing this unti nock-inspector gets typescriptified
    nock('http://api.thing')
      .persist()
      .put('/the/endpoint')
      .reply(function reply(this: ReplyFnContext, uri: string, requestBody: object) {
        requests.push({ uri, requestBody, headers: this.req.headers });
        return [200, { something: 'else' }, { headerThing: 'the header thing' }];
      });
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it('should make a request using request', function (done) {
    const requestWithDefaults = lambdaRequest({ name: 'nameFromPackage', version: 'versionFromPackage' }, request);
    requestWithDefaults(
      { method: 'PUT', uri: 'http://api.thing/the/endpoint', body: { some: 'thing' } },
      (err, result) => {
        expect(requests).to.deep.equal([
          {
            uri: '/the/endpoint',
            requestBody: {
              some: 'thing',
            },
            headers: {
              'user-agent': 'nameFromPackage/versionFromPackage node.js/v10.18.1',
              host: 'api.thing',
              accept: 'application/json',
              'content-type': 'application/json',
              'content-length': 16,
            },
          },
        ]);
        expect(result.body).to.deep.equal({ something: 'else' });
        expect(result.headers).to.deep.equal({
          'content-type': 'application/json',
          headerthing: 'the header thing',
        });
        done();
      }
    );
  });

  it('should make a request using request-promise', async function () {
    const requestWithDefaults = lambdaRequest(
      { name: 'nameFromPackage', version: 'versionFromPackage' },
      requestPromise
    );
    const result = await requestWithDefaults({
      method: 'PUT',
      uri: 'http://api.thing/the/endpoint',
      body: { some: 'thing' },
      resolveWithFullResponse: true,
    });
    expect(requests).to.deep.equal([
      {
        uri: '/the/endpoint',
        requestBody: {
          some: 'thing',
        },
        headers: {
          'user-agent': 'nameFromPackage/versionFromPackage node.js/v10.18.1',
          host: 'api.thing',
          accept: 'application/json',
          'content-type': 'application/json',
          'content-length': 16,
        },
      },
    ]);
    expect(result.body).to.deep.equal({ something: 'else' });
    expect(result.headers).to.deep.equal({
      'content-type': 'application/json',
      headerthing: 'the header thing',
    });
  });
});
