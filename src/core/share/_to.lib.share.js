(function () {

  const Module = {
    name: '_to',
    version: '1.0',
    dependencies: {
      _do: { type: 'object' },
      _is: { type: 'object' },
      _CONST: { type: 'object' },
      MSG: { type: 'object' },
    },
    factory: function (di) {
      const _to = {
        date: function toDate(val) {
          if (val && (typeof val === 'string' && di._is.ISODateString(val)) || typeof val === 'number') {
            val = new Date(val);
          }
          if (val instanceof Date && !Number.isNaN(val.getMilliseconds())) {
            return val;
          }
          return null;
        },
        lastDate(from, msAgo) {
          let last_date = _to.date(from);

          if (last_date) {
            last_date = new Date(last_date);
            last_date.setMilliseconds(last_date.getMilliseconds() - msAgo);
          }

          return last_date;
        },
        lastMonth(from) {
          let last_month = _to.date(from);

          if (last_month) {
            last_month = new Date(last_month);
            last_month.setMonth(last_month.getMonth() - 1);
          }

          return last_month;
        },
        featureDate(from, toMS) {
          return _to.lastDate(from, -toMS);
        },
        maxDate(...dates) {
          let max_date = null;

          for (let date of dates) {
            if (!date) { continue }
            date = _to.date(date);
            if (!date) { continue }
            if (max_date === null || date > max_date) {
              max_date = date;
            }
          }

          return max_date;
        },
        minDate(...dates) {
          let min_date = null;

          for (let date of dates) {
            if (!date) { continue }
            date = _to.date(date);
            if (!date) { continue }
            if (min_date === null || date < min_date) {
              min_date = date;
            }
          }

          return min_date;
        },
        utc7(val) {
          let date = _to.date(val);
          if (date) {
            date = new Date(date);
            date.setHours(date.getHours() + 7);
          }
          return date;
        },
        timestamp(val) {
          const date = _to.date(val);
          if (date) {
            return date.getTime();
          }
        },
        integer(val, default_value = null) {
          if (di._is.integer(val)) {
            return Number(val);
          }
          return default_value;
        },
        string(val, { is_trim = true } = {}) {
          if ([null, undefined].includes(val)) {
            return '';
          }
          let new_val = String(val);

          if (is_trim) {
            new_val = new_val.trim();
          }

          return new_val;
        },
        json(obj) {
          return JSON.parse(JSON.stringify(obj));
        },
        CODE({ ns = [], delimiter = '.', format }) {
          if (Array.isArray(ns)) {
            ns = ns.join(delimiter);
          }

          let prefix = '';

          if (typeof ns === 'string' && ns.length > 0) {
            prefix = ns + delimiter;
          }

          return function toCode(...paths) {
            let code = prefix + paths.join(delimiter);

            if (typeof format === 'function') {
              code = format(code);
            }

            return code;
          }
        },
      };

      return _to;
    }
  };

  //------------------------------ FACTORING ---------------------------//
  let di = {};
  if (typeof module === 'object' && module.exports) {
    di._do = require('./_do.lib.share');
    di._is = require('./_is.lib.share');
    di._CONST = require('./_CONST.lib.share');
    di.MSG = require('./MSG.lib.share');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();