'use strict';

const   expect = require('chai').expect,
    avg_work_length = require('../lib/avg_work_length'),
    moment = require('moment'),
    _ = require('lodash');

describe('Average length of work for each month', function() {
    const lengthList = avg_work_length(require('./employees.json'));
    const dateFormat = 'YYYY-MM';
    const fullDateFormat = 'YYYY-MM-DD';
    const lengthList_2013 = avg_work_length(require('./employees.json'), '2013-01', '2013-12');

    it('should contain entries for each month for the past two years', function() {
        expect(_.head(lengthList).date).to.equal(moment().subtract(2, 'years').format(dateFormat));
        expect(_.last(lengthList).date).to.equal(moment().format(dateFormat));
        expect(lengthList).to.have.lengthOf(25);
    });

    it('should have date and avg_length for all months', function() {
        expect(lengthList).to.not.be.empty;
        _.each(lengthList, (avgLength) => {
            expect(avgLength).to.have.all.keys(['date', 'avg_length']);
    });
    });

    it('should return correct data for given input - employee has been employed in current month, no work length', function() {
    var list = avg_work_length([{
        "id": 0,
        "dateOfEmployment": moment().startOf('month').format(fullDateFormat),
        "dateOfTermination": null,
        "dateOfBirth": "1978-06-06",
        "gender": "Male"
    }]);
        expect(_.last(list).avg_length).to.equal(0);

    });


it('should return correct data for given input', function() {
  var list = avg_work_length([{
    "id": 0,
    "dateOfEmployment": moment().subtract(2, 'month').startOf('month').format(fullDateFormat),
    "dateOfTermination": null,
    "dateOfBirth": "1978-06-06",
    "gender": "Male"
  }]);
  expect(list[23].avg_length).to.equal(1);
  list = avg_work_length([{
    "id": 0,
    "dateOfEmployment": moment().subtract(24, 'month').startOf('month').format(fullDateFormat),
    "dateOfTermination": null,
    "dateOfBirth": "1978-06-06",
    "gender": "Male"
  }]);
  expect(list[0].avg_length).to.equal(0);
  expect(list[1].avg_length).to.equal(1);
  expect(list[23].avg_length).to.equal(23);

});


it('should have 12 months from 2013-01 to 2013-12', function() {
  expect(lengthList_2013).to.not.be.empty;
  _.each(lengthList_2013, (avgLength) => {
    expect(avgLength).to.have.all.keys(['date', 'avg_length']);
  expect(lengthList_2013.length).to.equal(12);
  expect(lengthList_2013[0].date).to.equal('2013-01');
  expect(lengthList_2013[11].date).to.equal('2013-12');
});
});


});