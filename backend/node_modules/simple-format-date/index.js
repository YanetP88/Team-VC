var template = require('lodash/template');
var padStart = require('lodash/padStart');
var templates = {};
var defaults = {
  template: '<%= YY %>-<%= MM %>-<%= DD %>'
};

function getLocals(date) {
  var YY = date.getFullYear();
  var M = date.getMonth() + 1;
  var D = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  return {
    Y: String(YY).substr(-2),   // short year (15 for 2015)
    YY: YY,                     // numeric long year
    M: M,                       // numeric month (9 for September)
    MM: padStart(M, 2, '0'),    // padded month ('09' for September)
    D: D,                       // numeric day
    DD: padStart(D, 2, '0'),    // padded day
    h: h,                       // numeric hours
    hh: padStart(h, 2, '0'),    // padded hours
    m: m,                       // numeric minutes
    mm: padStart(m, 2, '0'),    // padded minutes
    s: s,                       // numeric secs
    ss: padStart(s, 2, '0')     // padded secs
  };
}

function formatDate(d, options) {
  options = options || defaults;
  var formatter = options.template;
  if (typeof formatter === 'string') {
    // compile the template just once
    formatter = ( templates[formatter] = templates[formatter] || template(formatter) );
  }
  return formatter(getLocals(d));
}

module.exports = formatDate;