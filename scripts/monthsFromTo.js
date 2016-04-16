'use strict'

/**
 * returns number of months from start date to end date
 * @param start_date  -  date object
 * @param end_date  -  date object
 * @returns {number}
 */

module.exports = function (start_date, end_date) {
  if(end_date.isSameOrBefore(start_date, 'day')) {
    return 0;
  }else{
    return (end_date.year() - start_date.year())*12 + end_date.month() - start_date.month();
  }
}