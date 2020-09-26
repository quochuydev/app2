// import common from '../../../utils/common';

import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
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
  if (!value) {
    value = 0;
  }
  return <NumberFormat value={value} displayType={'text'} suffix={'đ'} thousandSeparator={true} />
}

common.formatFinancialStatus = function (value) {
  if (!value) {
    value = '';
  }
  return value;
}

common.cssProductType = (type) => {
  switch (type) {
    case 'woocommerce':
      return 'magenta';
    case 'haravan':
      return 'blue';
    case 'shopify':
      return 'green';
    default:
      return 'red';
  }
}

common.colorStatus = (status) => {
  switch (status) {
    case 'success': case 'delivered': case 'paid':
      return 'green';
    case 'fail':
      return 'red';
    default:
      return 'blue';
  }
}

common.cssStatus = (status) => {
  switch (status) {
    case 'success': case 'delivered': case 'paid':
      return 'green';
    case 'fail':
      return 'red';
    default:
      return 'blue';
  }
}

common.formatFulfillmentStatus = function (code) {
  switch (code) {
    case 'delivered':
      return 'Đã giao hàng';
    case 'delivering':
      return 'Đang giao hàng';
    default:
      return ''
  }
}

common.textFinancial = function (code) {
  switch (code) {
    case 'paid':
      return 'Đã thanh toán';
    case "partially_paid":
      return "Đã thanh toán một phần";
    case "pending":
      return "Chưa thanh toán";
    case "refunded":
      return "Đã hoàn tiền";
    case "voided":
      return "Đã hủy";
    default:
      return ''
  }
}

common.formatCodStatus = function (code) {
  switch (code) {
    case "codpending":
      return "Chưa nhận";
    case 'codreceipt':
      return 'Đã nhận';
    default:
      return ''
  }
}

export default common;