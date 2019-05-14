const assert = require('chai').assert;
const app = require('../app');

describe('App', function(){
  it('app name should return', function(){
    let result = app.appName();
    assert.equal(result, 'iiotrestapi');
  });
});
