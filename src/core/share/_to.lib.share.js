(function () {

  const Module = {
    name    : '_to',
    version : '1.0',
    dependencies : {
      _do : { type : 'object' },
      _is : { type : 'object' },
      _CONST : { type : 'object' },
      MSG : { type : 'object' },
    },
    factory : function (di) {
      const _to = {
        date : function toDate(val) {
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
        string(val, { is_trim = true }={}) {
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
        order_event_history_actions_map : {
          ASSIGNED_EMPLOYEE : 'assigned_user',
          PAYMENT_CONFIRMED : 'financial_confirm',
          CONFIRMED : 'update_status',
          CONFIRMED_AND_ASSIGNED_STORE: 'confirmed_and_assigned_store',
          ASSIGNED_STORE: 'assigned_store',
          STOCK_ON_HAND: 'update_status',
          OUT_OF_STOCK: 'update_status',
          WAITING_FOR_OUTPUT: 'update_status',
          OUTPUTTED: 'update_status',
          CARRIER_DELIVERED: 'update_status',
          SELF_DELIVERED: 'update_status',
          COMPLETED: 'update_status',
          CANCELLED_AND_RESTOCKED: 'cancel_order',
          CANCELLED_AND_REFUNDED: 'cancel_order',
          CANCELLED: 'cancel_order',
        },
        orderAction(eventName) {
          const { _do } = di;

          const [topic, action] = _do.parseEventName(eventName);
      
          if (action) {
            return _to.order_event_history_actions_map[action.toUpperCase()];
          }
          
          return null;
        },
        client : { 
          error : {
            messages(requestError, defaultMessage) {
              let error = requestError;

              let body = requestError.data;

              if (body && typeof body === 'object' && Object.keys(body).length > 0) {
                error = body;
              }

              return di._do.extractErrorMessages({ error, defaultMessage, isRemoveDuplicatedMessages: true });
            },
            message(requestError, defaultMessage) {
              return _to.client.error.messages(requestError, defaultMessage).join('\n');
            }
          }
        },
        /**
         * split array to multi patches by size
         * @param {array} array 
         * @param {number} size 
         * 
         * @example
         * 
         * _to.multiPatches([1, 2, 3, 4, 5, 6, 7], 3);
         * => [
         *  [1, 2, 3],
         *  [4, 5, 6],
         *  [7]
         * ]
         * 
         */
        multiPatches(array, size) {
          const patches = [];

          if (Array.isArray(array)) {
            let patch = [];

            for (let i = 0; i < array.length; i++) {
              patch.push(array[i]);

              if (patch.length >= size || i + 1 >= array.length) {
                patches.push(patch);
                patch = [];
              }
            }
          }

          return patches;
        },
        fulfillments_carrier_status_position (carrier_status_code) {
          carrier_status_code = String(carrier_status_code).toLowerCase();
          switch (carrier_status_code) {
            case "pending":
              return 0;
            case "readytopick":
              return 1;
            case "picking":
              return 2;
            case "delivering":
              return 3;
            case "notmeetcustomer":
              return 4;
            case "waitingforreturn":
              return 5;
            case "delivered":
              return 6;
            case "cancel":
              return 7;
            case "return":
              return 8;
            default:
              return 0;
          }
        },
        financial_status_position (financial_status) {
          switch (financial_status) {
            case "pending":
              return 0;
            case "partially_paid":
            case "partiallypaid":
              return 1;
            case "paid":
              return 2;
            case "partially_refunded":
            case  "partiallyrefunded":
              return 3;
            case "refunded":
              return 4;
            case "voided":
              return 5;
            default:
              return 0;
          }
        },
        info_each_product_input_status (status) {
          switch (status) {
            case false:
              return 'Chưa cập nhật';
            case true:
              return 'Đã cập nhật';
            default:
              return status;
          }
        },
        user: {
          inLocations({ user, type }) {
            const { _is } = di;

            let in_locations = null;

            if (_is.user.store(user) || _is.user.location(user)) {
              if (Array.isArray(user.in_locations)) {
                in_locations = user.in_locations;
                if (type) {
                  in_locations = in_locations.map(item => type(item));
                }
              }
            }
            
            return in_locations;
          },
          eventData(user) {
            const { _is } = di;

            if (_is.user.adapter(user)) {
              return { user_id: user._id, user };
            }
            return { user_id: user._id };
          }
        },
        inventoryHistoryActivityName (activity) {
          return _.get(di._CONST, ['ACTIVITY_INFO', activity, 'client_short_name'], '');
        },
        inventoryUpdateTypeName (type) {
          return _.get(di._CONST, ['UPDATE_INVENTORY_TYPE_LIST', type, 'name'], '');
        },
        inventoryUpdateReasonName (reason) {
          return _.get(di._CONST, ['INVENTORY_REASONS_LIST', reason, 'name'], '');
        },
        fieldErrorMessage({ error }) {
          if (error) {
            if (error.keyword) {
              if (error.keyword === 'required') {
                return di.MSG('ME-00043');
              }
              else {
                return di.MSG('ME-00002', { abc: error.field_name || '' });
              }
            }
            if (error.message) {
              return error.message;
            }
          }
          return di.MSG('ME-00002', { abc: error.field_name || '' });
        },
        pageErrorMessage({ errors }) {
          const error = errors[0];
          if (error.keyword) {
            if (error.keyword === 'required') {
              return di.MSG('ME-00211');
            }
          }
          if (error.message) {
            return error.message;
          }
          return di.MSG('ME-00002', { abc: error.field_name || '' });
        }
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