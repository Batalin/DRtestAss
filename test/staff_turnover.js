'use strict';

const   expect = require('chai').expect,
    getTurnover = require('../lib/staff_turnover'),
    moment = require('moment'),
    _ = require('lodash');

    describe('Staf turnover per month', function() {
    const turnoverList = getTurnover(require('./employees.json'));
    const dateFormat = 'YYYY-MM';

    it('should contain entries for each month for the past two years', function() {
        expect(_.head(turnoverList).date).to.equal(moment().subtract(2, 'years').format(dateFormat));
        expect(_.last(turnoverList).date).to.equal(moment().format(dateFormat));
        expect(turnoverList).to.have.lengthOf(25);
    });

    it('should have date and turnover_rate for all months', function() {
        expect(turnoverList).to.not.be.empty;
        _.each(turnoverList, (turnover) => {
            expect(turnover).to.have.all.keys(['date', 'turnover_rate']);
        });
    });

  it('', function() {
    expect(turnoverList).to.not.be.empty;
    expect(_.some(turnoverList, {'date': '2015-07', 'turnover_rate': 0})).to.equal(true);
  });


});