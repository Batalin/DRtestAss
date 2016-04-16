'use strict';

/**
 * @type {exports}
 * @private
 */

const   _ = require('lodash'),
        moment = require('moment'),
        monthsFromTo= require('../scripts/monthsFromTo');

/**
 * Returns an array of objects with number of employees and corresponding month in each.
 * Default period of calculation is 2 years, but could be easily changed with period value.
 * Algorithm loops once through employeeData collection and maps work duration of employment to
 * the resultData array for current employee.
 * @employeeData  -  array of employee objects
 * @from  -  string with dates in format 'YYYY-MM'  optional
 * @to  -  string with dates in format 'YYYY-MM'    optional
 * @returns {{date: 'YYYY-MM', count: number}}
 */


module.exports = function(employeeData, from, to) {

    const period_start_date = typeof(from) === 'undefined' ? moment().subtract(2, 'year').endOf('month') : // start of the calc period, last day of a starting month
                                                             moment(from).endOf('month');                  // start of the calc period, last day of a starting month

    const period_end_date = typeof(to) === 'undefined' ? moment().endOf('month') :  // end date of the calc period, current moment
                                         moment(to).endOf('month');                 // end date of the calc period, last day of end month

    const period = monthsFromTo(period_start_date, period_end_date); // period of calculation


    var startMonth;         // first month of work in a period of calculation for current employee
    var endMonth;           // last month of work in a period of calculation for current employee
    var dateOfEmployment;   // employment date of a current employee
    var dateOfTermination;  // termination date of a current employee
    var resultData = create_months_array(period_end_date, period);

    _.each(employeeData, function(emp) {
        if(!employeeIsValid(emp)) {
            console.log("invalid data for - " + JSON.stringify(emp));
            return;
        }

        dateOfEmployment = moment(emp.dateOfEmployment);
        dateOfTermination = emp.dateOfTermination === null ? moment() : moment(emp.dateOfTermination);
        if (dateOfTermination.isBefore(period_start_date, 'day')) return;   // doesn't take into account if termination date is before the period start
        if (dateOfEmployment.isAfter(period_end_date)) return;              // doesn't take into account if employment date is after the period end

        startMonth = monthsFromTo(period_start_date, dateOfEmployment);

        if(dateOfTermination.isBefore(period_end_date)) {
            endMonth = (dateOfTermination.isSame(moment(dateOfTermination).endOf('month'), 'day')) ? monthsFromTo(period_start_date, dateOfTermination) :
                                                                                             monthsFromTo(period_start_date, dateOfTermination) - 1;
        } else {
            endMonth = period;
        }
        mapMonthsEmployed(startMonth, endMonth, resultData);    // map employee length of work to the resultData
    });
    //console.log(resultData);
    return resultData;
};


/**
 * increment count properties of input array 'data' for all members from index 'start' to index 'end'
 * @param start  -  number, represents array index
 * @param end  -  number, represents array index
 * @param data  -  array link
 */
function mapMonthsEmployed(start, end, data) {
    for(var i=start; i <= end;i++) {
        data[i].count += 1;
    }
}

/**
 * creates object with 'date' field stored 'YYYY-MM' format date and 'count' set to 0
 * @param n
 * @returns {{date: *, count: number}}
 */
function create_months_array(endDate, period){
    return _.range(period, -1, -1).map(function(i) {
        return {date: moment(endDate).subtract(i,'month').format('YYYY-MM'), count: 0};
    });
}

/**
 * @param employee  -  object
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