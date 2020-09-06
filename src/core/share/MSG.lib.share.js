(function () {

  /**
   * MSG(code : string, data ?: object) : string
   * 
   * @example
   * 
   * // nodejs :
   * const MSG = require(path.resolve('./modules/core/share/lib/MSG.lib.share.js'));
   * console.log(MSG('ME-00104'));
   * console.log(MSG('ME-00062', { abc : 'Chi nhánh' }));
   * // browser : MSG is global
   * console.log(MSG('ME-00104'));
   * console.log(MSG('ME-00062', { abc : 'Chi nhánh' }));
   * // Wil print :
   * File không đúng định dạng cho phép (.xlsx). Vui lòng chọn lại.
   * Chi nhánh không hợp lệ.
   */
  const Module = {
    name    : 'MSG',
    version : '1.0',
    dependencies : {
      _do : { name : '_do' }
    },
    factory : function (di) {
      
      const compile = di._do.Compile(/\[.+?\]/g);

      const messages = {
        
      };

      function has(code) {
        return messages.hasOwnProperty(code);
      }

      function MSG(code, data) {
        if (!has(code)) { 
          return '';
        }

        const message = messages[code];

        if (data) {
          return compile(message, data);
        }

        return message;
      }

      return Object.assign(MSG, { has });
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._do = require('./_do.lib.share');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();