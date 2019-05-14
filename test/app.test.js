const assert = require('chai').assert;
const app = require('../app');

describe('App', function(){
  it('app name should return', function(){
    let result = app.AppName('1.2.3.4');
    assert.equal(result, 'iiotrestapi-1.2.3.4');
  });
});
