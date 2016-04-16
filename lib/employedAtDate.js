'use strict'

/**
 * @type {exports}
 * @private
 */
const   _ = require('lodash'),
  moment = require('moment');

/**
 * Returns array of employees who employed at date, passed to function
 * @param employeeData
 * @param date  -  date in format 'YYYY-MM-DD'
 * @returns {Array}
 */
module.exports = function(employeeData, date) {


  const search_date = moment(date);


  var resultData = [];
  var employmentDate;
  var terminationDate;

  _.filter(employeeData, function(emp) {
    employmentDate = moment(emp.dateOfEmployment);
    terminationDate = emp.dateOfTermination === null ? moment() : moment(emp.dateOfTermination);

    if(search_date.isSameOrAfter(employmentDate) && search_date.isSameOrBefore(terminationDate)) {
      resultData.push(emp);
    }
  });
  return resultData;

}