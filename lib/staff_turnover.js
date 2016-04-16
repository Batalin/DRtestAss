'use strict';

/**
 * @type {exports}
 * @private
 */

const   _ = require('lodash'),
    moment = require('moment'),
    employees = require('./employees'),
    monthsFromTo= require('../scripts/monthsFromTo');

/**
 *  Returns the employee turnover rate per month within a period of time.
 *
 *  turnover rate = number of the employees who terminate their contracts in a month divided by
 *  the total number of the employees at the beginning of month(last day of the previous one)
 *
 *  Number of the employees at every month can be taken from employees.js.
 *  Number of the terminations each month to be calculated.
 *
 * @employeeData  -  array of employee objects
 * @from  -  string with dates in format 'YYYY-MM' optional
 * @to  -  string with dates in format 'YYYY-MM'   optional
 * @returns {{date: 'YYYY-MM', turnover_rate: number}}
 */

module.exports = function(employeeData, from, to) {

    const employeeList = employees(employeeData, from, to);   // array of employees per month
    const period_start_date = moment(employeeList[0].date).endOf('month');
    const period_end_date = moment(employeeList[employeeList.length-1].date).endOf('month');

    var resultData = _.map(employeeList, function(obj) { return {date: obj.date, turnover_rate: 0};});
    var monthOfTerm;         // month number when employee quit from the start of a period
    var dateOfTermination;

    _.each(employeeData, function(emp) {
      if(emp.dateOfTermination === null) return; // employee is still working
      dateOfTermination = moment(emp.dateOfTermination);
      if(dateOfTermination.isBefore(period_start_date) || dateOfTermination.isAfter(period_end_date)) return; //employee term date is out of a period
        monthOfTerm = monthsFromTo(period_start_date, dateOfTermination);
        resultData[monthOfTerm].turnover_rate += 1;
    });

    _.each(resultData, function(month, index) {
        if(index == 0) {
            month.turnover_rate = 0;        // first month, no data about the number of employees from the previous month
        }else{
            month.turnover_rate = month.turnover_rate > 0 ? _.floor(month.turnover_rate/employeeList[index-1].count, 3) : 0;
        }
    });
  
    return resultData;
}