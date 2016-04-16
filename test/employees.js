'use strict';

const   expect = require('chai').expect,
        employees = require('../lib/employees'),
        moment = require('moment'),
        _ = require('lodash');

describe('List of employees', function() {
  const employeeList = employees(require('./employees.json'));
  const testEmpoyeeList = employees(require('./test.json'));
  const dateFormat = 'YYYY-MM';
  const fullDateFormat = 'YYYY-MM-DD';

  it('should contain entries for each month for the past two years', function() {
    expect(_.head(employeeList).date).to.equal(moment().subtract(2, 'years').format(dateFormat));
    expect(_.last(employeeList).date).to.equal(moment().format(dateFormat));
    expect(employeeList).to.have.lengthOf(25);
  });

  it('should have date and count for all months', function() {
    expect(employeeList).to.not.be.empty;
    _.each(employeeList, (employee) => {
      expect(employee).to.have.all.keys(['date', 'count']);
    });
  });

  it('should return correct data for given input - employment and termination dates are in one month (no information in result)', function() {
      var list = employees([{
          "id": 0,
          "dateOfEmployment": moment().subtract(2, 'month').startOf('month').format(fullDateFormat),
          "dateOfTermination": moment().subtract(2, 'month').startOf('month').add(2,'day').format(fullDateFormat),
          "dateOfBirth": "1978-06-06",
          "gender": "Male"
      }]);
      _.each(list, (employee) => {
          expect(employee.count).to.equal(0);
      });
  });

  it('should return correct data for given input - termination date is in month next to employment (employed for one month)', function() {
    var list = employees([{
        "id": 0,
        "dateOfEmployment": moment().subtract(10, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": moment().subtract(9, 'month').startOf('month').format(fullDateFormat),
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }]);
    expect(list[24-10].count).to.equal(1);
  });

  it('should return correct data for given input - termination date is after two months of employment date (employed for two months)', function() {
    var list = employees([{
        "id": 0,
        "dateOfEmployment": moment().subtract(11, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": moment().subtract(9, 'month').startOf('month').format(fullDateFormat),
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }]);
    expect(_.some(list, {date: moment().subtract(11, 'month').format(dateFormat), count: 1})  &&
    _.some(list, {date: moment().subtract(11, 'month').format(dateFormat), count: 1})).to.equal(true);
  });

  it('should return correct data for given input - employment date is before the beginning of a tested period and still employed (employed for all months)', function() {
    var list = employees([{
        "id": 0,
        "dateOfEmployment": moment().subtract(30, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }]);
      _.each(_.slice(list, 0, list.length-1), (employee) => {
          expect(employee.count).to.equal(1);
      });
  });

  it('should have data for two persons, both employed for all months', function() {
    var list = employees([{
        "id": 0,
        "dateOfEmployment": moment().subtract(30, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    },{
        "id": 0,
        "dateOfEmployment": moment().subtract(30, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }]);
    _.each(_.slice(list, 0, 24), (employee) => {
        expect(employee.count).to.equal(2);
    });
  });

  it('should have data for two persons from 2013-10 to 2013-12, method calculates employees for 2013 year', function() {
    var list = employees([{
        "id": 0,
        "dateOfEmployment": moment().subtract(30, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    },{
        "id": 0,
        "dateOfEmployment": moment().subtract(30, 'month').startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }], '2013-01-01', '2013-12-31');
    _.every(_.slice(list, 9, 12), (employee) => {
        expect(employee.count).to.equal(2);
  });
  });


});