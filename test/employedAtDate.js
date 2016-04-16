'use strict';

const   expect = require('chai').expect,
  employedAdDate = require('../lib/employedAtDate'),
  moment = require('moment'),
  _ = require('lodash');

describe('List of employees employed at 2016-04-01', function() {
  const dateFormat = 'YYYY-MM';
  const fullDateFormat = 'YYYY-MM-DD';
  var employeeList;

  it('should contains 50 entries', function () {
    employeeList = employedAdDate(require('./employees.json'), '2016-04-01');
    expect(employeeList).to.have.lengthOf(50);
  });


});
