const assert = require('chai').assert;
const nock = require('nock');
const app = require('../app');

describe('App', () => {
  it('app name should return', () => {
    let result = app.AppName('1.2.3.4');
    assert.equal(result, 'iiotrestapi-1.2.3.4');
  });
});


describe('SoftwareVersionAdapterPost Pass', () => {
  it('app name should return', () => {

    nock('https://iiot.com')
      .post('/v1/edm/software_versions', {version_name: '1.2.3.4'})
      .reply(200, {});

    let result = app.SoftwareVersionAdapterPost('1.2.3.4', 10, 20);

    console.log('AGE: ' + result);

    assert.equal(result.status, 200);
  });
});

describe('SoftwareVersionAdapterPost Fail', () => {
  it('app name should return', () => {
    let result = app.AppName('1.2.3.4');
    assert.equal(result, 'iiotrestapi-1.2.3.4');
  });
});
