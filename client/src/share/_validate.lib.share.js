(function () {

  const Module = {
    name: '_validate',
    version: '1.0',
    dependencies: {
      _: { name: 'lodash' },
      _is: { name: '_is' },
      _do: { name: '_do' },
      _CONST: { name: '_CONST' },
      MSG: { name: 'MSG' },
    },
    factory: function (di) {
      const _validate = {};

      class ERR extends Error {
        constructor(props) {
          super();
          if (props) { 
            Object.assign(this, props) 
          }
        }
      }

      _validate.ERR = ERR;

      _validate.fields = {};

      _validate.fields['setting.request_pay.max_confirm_payment_wait_time'] = ({ field, value }) => {
        const { _is } = di;
        if (!(_is.integer(value) && value >= 1 && value <= 4320)) {
          return new ERR({ message: 'Thời gian chờ thanh toán tối đa (Phút) phải >= 20 và <= 4320', keyword: 'range', field, value })
        }
        return null;
      }

      /**
       * validate {value} of {field}
       * 
       * @return {Error | null} error
       * 
       * @example
       * 
       * const max_confirm_payment_wait_time_error = _validate.one({
       *   field: 'setting.request_pay.max_confirm_payment_wait_time', 
       *   value: 10
       * });
       * 
       * if (max_confirm_payment_wait_time_error) {
       *   return res.status(400).json(max_confirm_payment_wait_time_error)
       * }
       */
      _validate.one = ({ field, value }) => {
        const validate_field = _validate.fields[field];

        if (!validate_field) {
          throw new ERR({ code: 'ERR_INVALID_FIELD', field });
        }

        return validate_field({ field, value });
      }

      /**
       * validate each {value} of {field} in list { field_values }
       * 
       * @return {{ has_error: boolean, errors: Array<Error> }}
       * 
       * @example
       * 
       * const { has_error, errors } = _validate.list({ field_values: 
       *   [
       *     {
       *       field: 'setting.request_pay.max_confirm_payment_wait_time', 
       *       value: 10
       *     }
       *   ]
       * });
       * 
       * if (has_error) {
       *   return res.status(400).json({ code: 'ERR_VALIDATION_FAILED', errors })
       * }
       */
      _validate.list = ({ field_values }) => {
        const errors = [];

        if (Array.isArray(field_values) && field_values.length > 0) {
          for (let { field, value } of field_values) {
            const error = _validate.one({ field, value });
            if (error) {
              errors.push(error);
            }
          }
        }

        const has_error = errors.length > 0;

        return { has_error, errors };
      }

      /**
       * validate each {value} of {field} in map { field_values }
       * 
       * @return {{ has_error: boolean, errors: Array<Error> }}
       * 
       * @example
       * 
       * const { has_error, errors } = _validate.map({
       *   field_values: {
       *     'setting.request_pay.max_confirm_payment_wait_time': 10
       *   }
       * });
       * 
       * if (has_error) {
       *   return res.status(400).json({ code: 'ERR_VALIDATION_FAILED', errors })
       * }
       */
      _validate.map = ({ field_values }) => {
        const errors = [];

        if (typeof field_values ) {
          for (let { field, value } of field_values) {
            const error = _validate.one({ field, value });
            if (error) {
              errors.push(error);
            }
          }
        }

        const has_error = errors.length > 0;

        return { has_error, errors };  
      }

      return _validate;
    }
  }

  let di = {};

  if (typeof module === 'object' && module.exports) {
    const path = require('path');

    di._ = require('lodash');
    di._is = require('./_is.lib.share.js');
    di._do = require('./_do.lib.share.js');
    di._CONST = require('./_CONST.lib.share');
    di.MSG = require('./MSG.lib.share');

    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();