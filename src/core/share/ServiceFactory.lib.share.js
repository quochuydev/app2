(function () {

  const Module = {
    name: 'ServiceFactory',
    version: '1.0',
    dependencies : {
      _   : { name : 'lodash' },
    },
    factory: function ({ _ }) {

      /**
       * Like Class, support dependencies for easy testing, some modifier (private, protected, public), decorators, hooks
       * 
       * @param {object} service 
       * @param {string} service.code
       * @param {object} service.dependencies
       * @param {object} service.statics 
       * @param {function} factory
       * 
       * @return {function} service factory
       * 
       * @references \
       * * LogProcessService : 
       * * * a base service
       * * * at : modules/order-auto-process/server/businesses/log-process.server.business.js:14
       * 
       * * LogAutoProcessOrderService : 
       * * * a child service, inherit from LogProcessService
       * * * feature : hooks
       * * * at : modules/order-auto-process/server/businesses/log-auto-process-order.server.business.js:17
       * 
       * * LogAutoDivideOrderService : 
       * * * another child service, inherit from LogProcessService
       * * * feature : decorators
       * * * at : modules/order-auto-process/server/businesses/log-auto-divide-order.server.business.js:12
       */
      function ServiceFactory(service) {

        const statics = {
          code : service.code,
          ...service.statics
        };

        function createService(dependencies = {}, options) {
          const { extender, instance = {} } = { ...options };

          instance.code = instance.code || service.code;
          instance.CODE = instance.CODE || service.code;

          const modifiers = {
            private : new Set(),
            protected : new Set(),
            public : new Set(),
            properties : {}
          };

          const selfOverrider = ({ key, value, modifiers }) => {
            if (instance.hasOwnProperty(key)) {
              instance[key] = value;
              // TODO set modifiers ...
              return true;
            }
            return false;
          }

          const overriders = [selfOverrider];

          if (service.dependencies && typeof service.dependencies === 'object') {
            for (let key in service.dependencies) {
              if (dependencies[key] === undefined) {
                if (service.dependencies[key].default !== undefined) {
                  if (typeof service.dependencies[key].default === 'function') {
                    dependencies[key] = service.dependencies[key].default();
                  }
                  else {
                    dependencies[key] = service.dependencies[key].default;
                  }
                }
                else {
                  throw new Error(`Missing dependency ${key}`);
                }
              }
            } 
          }

          if ((Array.isArray(service.bases) && service.bases.length > 0)) {
            for (let BaseServiceFactory of service.bases) {
              BaseServiceFactory(dependencies, { extender : base => {
                _.merge(instance, base.instance);
                mergeModifiers(modifiers, base.modifiers);
                overriders.push(base.overrider);
              }});
            }
          }
            
          const source = service.factory(dependencies, instance, statics);

          setGroupProperties({ instance, iModifiers : modifiers, group : source.extends });
          
          doOverride({ instance, iModifiers : modifiers, overriders, group : _.pick(source, ['private', 'protected', 'public']) });

          if (source.overrides) {
            doOverride({ instance, iModifiers : modifiers, overriders, group : source.overrides });
          }

          if (source.hooks) {
            useHooks({ instance, hooks : source.hooks });
          }

          doDecorate({ instance, decorators : source.decorators });

          if (typeof extender === 'function') {
            const childView = _.pick(instance, [
              ...Array.from(modifiers.protected),
              ...Array.from(modifiers.public)
            ]);
            const childModifiers = _.pick(modifiers, ['protected', 'public']);
            
            extender({ instance : childView, modifiers : childModifiers, overrider : selfOverrider });
          }
          else {
            const publicView = _.pick(instance, Array.from(modifiers.public));
  
            return publicView;
          }
        }

        Object.assign(createService, statics);

        return createService;
      };

      function useHooks({ instance, hooks, path = [] }) {
        if (typeof hooks === 'function') {
          const hookName = path.pop();
          const method = _.get(instance, path);

          if (typeof method === 'function') {
            method.hook(hookName, hooks);
            return instance;
          }
          else {
            throw new Error(`Can't apply hook ${hookName} : ${method} is not a method`);
          }
        }
        if (typeof hooks === 'object') {
          for (let key in hooks) {
            useHooks({ instance, hooks : hooks[key], path : [...path, key] });
          }
          return instance;
        }
        throw new TypeError(`hook expected a function or object, but received ${hooks}`);
      }

      function mergeModifiers(target, source) {
        if (source && typeof source === 'object') {
          for (let modifier in source) {
            if (!target[modifier]) {
              target[modifier] = [];
            }

            for (let prop of source[modifier]) {
              if (!target[modifier].has(prop)) {
                target[modifier].add(prop);
              }
            }
          }
        }

        return target;
      }

      function setGroupProperties({ instance, iModifiers, group }) {
        if (group && typeof group === 'object') {
          for (let pModifier in group) {
            let properties = group[pModifier];
            setProperties({ instance, iModifiers, properties, pModifiers : [pModifier] });
          }
        }
        return instance;
      }

      function setProperties({ instance, iModifiers, properties, pModifiers = [] }) {
        if (properties && typeof properties === 'object') {
          for (let key in properties) {
            let value = properties[key];
            setProperty({ instance, iModifiers, key, value, pModifiers });
          }
        }
        return instance;
      }

      function setProperty({ instance, iModifiers, key, value, pModifiers = [] }) {
        instance[key] = value;

        for (let pModifier of pModifiers) {
          if (!iModifiers[pModifier]) {
            iModifiers[pModifier] = new Set();
          }
          if (!iModifiers[pModifier].has(key)) {
            iModifiers[pModifier].add(key);
          }
        }

        return instance;
      }

      function doDecorate({ instance, decorators, paths = [] }) {
        if (decorators && typeof decorators === 'object') {
          for (let key in decorators) {
            let decorator = decorators[key];

            if (typeof decorator === 'function') {
              let propertyPath = [...paths, key];
              let originMethod = _.get(instance, propertyPath);
              if (typeof originMethod !== 'function') {
                throw new Error(`Decorate method at path ${propertyPath} failed : ${originMethod} is not a function`);
              }
              let decoratedMethod = decorator(originMethod);
              _.set(instance, propertyPath, decoratedMethod);
            }
          }
        }
        return instance;
      }

      function doOverride({ instance, iModifiers, overriders, group }) {
        if (group && typeof group === 'object') {
          for (let pModifier in group) {
            let properties = group[pModifier];
            
            if (properties && typeof properties === 'object') {
              for (let key in properties) {
                let value = properties[key];

                let isOverrode = false;
                for (let _override of overriders) {
                  if (_override({ key, value, modifiers : [pModifier] })) {
                    isOverrode = true;
                  }
                }

                if (!isOverrode) {
                  setProperty({ instance, iModifiers, key, value, pModifiers : [pModifier] });
                }
              }
            }
          }
        }
        return instance;
      }

      return ServiceFactory;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di._           = require('lodash');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();