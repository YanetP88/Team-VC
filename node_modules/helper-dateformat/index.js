'use strict';

var dateformat = require('dateformat');
var typeOf = require('kind-of');

module.exports = function(date, format) {
  if (typeOf(date) !== 'date') {
    format = date;
    date = new Date();
  }

  if (typeof format !== 'string' || format === 'today') {
    format = 'mmmm dd, yyyy';
  }
  return dateformat(date, format);
};
