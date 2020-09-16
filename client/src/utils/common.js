// import common from '../../../utils/common';

import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import CurrencyFormat from 'react-currency-format';
import NumberFormat from 'react-number-format';

const common = {}

common.compile = function compile(template, data) {
  let result = template.toString ? template.toString() : '';
  result = result.replace(/{.+?}/g, function (matcher) {
    var path = matcher.slice(1, -1).trim();
    return _.get(data, path, '');
  });
  return result;
}

common.formatMoney = function (value) {
  if(!value) {
    value = 0;
  }
  return <NumberFormat value={value} displayType={'text'} suffix={'đ'} thousandSeparator={true} />
}

common.formatFinancialStatus = function (value) {
  if(!value) {
    value = '';
  }
  return value;
}


export default common;