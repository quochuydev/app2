import _ from 'lodash';

const common = {}

common.compile = function compile(template, data) {
  let result = template.toString ? template.toString() : '';
  result = result.replace(/{.+?}/g, function (matcher) {
    var path = matcher.slice(1, -1).trim();
    return _.get(data, path, '');
  });
  return result;
}

export default common;