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
 *  * Returns array with average length of work for all employees currently employed by the company, this values shows
 * current experience rate of company's staff
 *
 * Algorithm works similar to employees.js
 * Algorithm goes once through the employeeData array and calculate start, end months of work and duration in months,
 * after that duration maps to the time line. Duration maps for each month with different values:
 *
 * actual_duration = duration - last_month_of_work_within_calculated_period + number_of_current_month
 *
 * That duration values are accumulated in resultData array for each month, when loop is over
 * average duration for each month  = sum of durations / number of employees   per month
 * @employeeData  -  array of employee objects
 * @from  -  string with dates in format 'YYYY-MM'  optional
 * @to  -  string with dates in format 'YYYY-MM'    optional
 * @returns {{date: 'YYYY-MM', avg_length: number}}
 */

module.exports = function(employeeData, from, to) {

  const employeeList = employees(employeeData, from, to);  //  list of staff employed per month
  const period_start_date = moment(employeeList[0].date).endOf('month');
  const period_end_date = moment(employeeList[employeeList.length-1].date).endOf('month');

  var resultData = _.map(employeeList, function(obj) { return {date: obj.date, avg_length: 0};});
  var duration;   //  length of work for current employee
  var start;      //  first month of work in a period of calculation for current employee
  var end;        //  last month of work in a period of calculation for current employee
  var startDate;  //  employment date of a current employee
  var endDate;    //  termination date of a current employee

  _.each(employeeData, function(emp) {
    if(!employeeIsValid(emp)){
      console.log("invalid data for - " + JSON.stringify(emp));
      return;
    }
    start = 0;
    end = 0;
    duration = 0;
    startDate = moment(emp.dateOfEmployment);
    endDate = emp.dateOfTermination === null ? moment() : moment(emp.dateOfTermination);
    if(endDate.isBefore(period_start_date)) return;           // discard all employees who are not employed within a period
    if(startDate.isAfter(period_end_date))  return;           // discard all employees who are not employed within a period
    start = startDate.isBefore(period_start_date) ? 0 : monthsFromTo(period_start_date, startDate);
    end = endDate.isAfter(period_end_date) ? resultData.length-1 : monthsFromTo(period_start_date, endDate);

    duration = moment.duration(endDate.diff(startDate)).asMonths();
    for(;start <= end; start++) {   // loop through the time range and sum work length for each month for the current employee
      resultData[start].avg_length += duration - end + start;
    }
  });

  _.each(resultData, function(obj, index) {  // divide sum of the durations of all workers in each month by corresponding number of workers for that month
    obj.avg_length = employeeList[index].count == 0 ? 0 : _.floor(obj.avg_length / employeeList[index].count);
  });

  return resultData;
}



/**
 * @param employee
 * @returns {boolean}
 */
function employeeIsValid(employee) {
    var requiredKeys = ['id','dateOfEmployment','dateOfTermination','dateOfBirth','gender'];
    if(
        moment(employee.dateOfEmployment).isValid('YYYY-MM-DD') &&
        (employee.dateOfTermination === null || moment(employee.dateOfTermination).isValid('YYYY-MM-DD'))&&
        moment(employee.dateOfBirth).isValid('YYYY-MM-DD') &&
        _.every(requiredKeys, _.partial(_.has, employee))) return true;
    return false;
}