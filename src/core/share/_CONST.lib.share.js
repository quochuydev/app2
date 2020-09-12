(function () {

  const Module = {
    name: '_CONST',
    version: '1.0',
    factory: function () {

      const _CONST = {
        IS: {
          TRUE: true,
          FALSE: false,
          ALL: '*'
        },
      };

      return _CONST;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    window[Module.name] = Module.factory(di);
  }
})();