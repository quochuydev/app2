'use strict';

const _ = require('lodash');
const path = require('path');
const { injectConfig } = require('./call.server.api');
let _is = require(path.resolve('./src/core/share/_is.lib.share.js'))
const { ApiUtils } = require('./utils.server.api');
const { ERR } = require('../libs/errors.server.lib');

const HR = {
  CODE : 'SV_HARAVAN'
};

HR.ORDERS = {
  CREATE : {
    transform   : ({ data, user, shop }) => Object({ body : { order: data }, user, shop }),
    method      : 'post',
    url         : 'admin/orders.json',
    resPath     : 'body.order',
  },
  UPDATE : {
    transform   : ({ order_id, data, user, shop }) => Object({ params : { order_id : order_id }, body : { order: data }, user, shop }),
    method      : 'put',
    url         : 'admin/orders/{order_id}.json',
    resPath     : 'body.order',
  },
  GET : {
    transform : ({ order_id, user, shop }) => Object({ params : { order_id }, user, shop }),
    method    : 'get',
    url       : 'admin/orders/{order_id}.json',
    resPath   : 'body.order'
  },
  LIST: {
    transform : ({ query, user, shop }) => Object({ query, user, shop }),
    method    : 'get',
    url       : 'admin/orders.json',
    resPath   : 'body.orders'
  },
  COUNT: {
    transform : ({ query, user, shop }) => Object({ query, user, shop }),
    method    : 'get',
    url       : 'admin/orders/count.json',
    resPath   : 'body.count'
  },
  TRANSACTIONS : {
    COMPLETE : {
      transform : ({ order_id, user, shop }) => Object({ 
        params  : { order_id }, 
        body    : { transaction : { kind: 'capture', send_email: true, user_id : user._id } }, 
        user, shop
      }),
      method    : 'post',
      url       : 'admin/orders/{order_id}/transactions.json',
      resPath   : 'body.transaction'
    },
  },
  CONFIRM : {
    transform : ({ order_id, user, shop }) => Object({ params : { order_id }, user, shop }),
    method    : 'post',
    url       : 'admin/orders/{order_id}/confirm.json',
    resPath   : 'body.order'
  },
  FULFILLMENTS : {
    CREATE : {
      transform : ({ order_id, fulfillment, user, shop }) => Object({ params : { order_id }, body : { fulfillment }, user, shop }),
      method    : 'post',
      url       : 'admin/orders/{order_id}/fulfillments.json',
      resPath   : 'body.fulfillment'
    },
    UPDATE : {
      transform : ({ order_id, fulfillment_id, fulfillment, user, shop }) => Object({ params : { order_id, fulfillment_id }, body : { fulfillment }, user, shop }),
      method    : 'put',
      url       : 'admin/orders/{order_id}/fulfillments/{fulfillment_id}.json',
      resPath   : 'body.fulfillment'
    },
  },
  CANCEL: {
    transform : ({ order_id, data, user, shop }) => Object({ params : { order_id }, body : data, user, shop }),
    method    : 'post',
    url       : 'admin/orders/{order_id}/cancel.json',
    resPath   : 'body.order',
    simple_data : {
      reason: 'fraud',
      note: 'not like',
      restock: true,
      ignore_cancel_fulfillment: true,
      email: true
    }
  },
  REFUNDS: {
    CREATE: {
      transform: ({ data, order_id, user, shop }) => {
        const { note, restock, refund_line_items, transactions = [] } = data;
        const obj = Object({
          params: { order_id }, user, shop,
          body: {
            refund: {
              note,
              restock,
              notify: true,
              shipping: {
                full_refund: false
              },
              refund_line_items,
              transactions
            }
          }
        });
        return obj;
      },
      method: 'post',
      url: 'admin/orders/{order_id}/refunds.json',
      resPath: 'body.refund'
    }
  }
};

HR.COLLECTS = {
  FIND : {
    transform   : ({ query, user, shop }) => Object({ query , user, shop }),
    method      : 'get',
    url         : 'admin/collects.json',
    resPath     : 'body.collects',
  },
  GET : {
    transform   : ({ collection_id, user, shop }) => Object({ params : { collection_id }, user, shop }),
    method      : 'get',
    url         : 'admin/collects/{collection_id}.json',
    resPath     : 'body.collect',
  }
}

HR.PRODUCTS = {
  COUNT : {
    method    : 'get',
    url       : 'admin/products/count.json',
    resPath   : 'body.count'
  },
  FIND : {
    method    : 'get',
    url       : 'admin/products.json',
    resPath   : 'body.products'
  },
  GET : {
    method    : 'get',
    url       : 'admin/products/{id}.json',
    resPath   : 'body.product'
  },
  CREATE : {
    transform : ({ data, user, shop }) => Object({ body : { product: data }, user, shop }),
    method    : 'post',
    url       : 'admin/products.json',
    resPath   : 'body.product'
  },
  UPDATE : {
    transform : ({ product_id, data, user, shop }) => Object({ params : { product_id }, body : { product: data }, user, shop }),
    method    : 'put',
    url       : 'admin/products/{product_id}.json',
    resPath   : 'body.product'
  },
}

HR.VARIANTS = {
  GET : {
    transform : ({ variant_id, user, shop }) => Object({ params : { variant_id }, user, shop }),
    method    : 'get',
    url       : 'admin/variants/{variant_id}.json',
    resPath   : 'body.variant'
  },
  CREATE: {
    transform : ({ product_id, data, user, shop }) => Object({ params : { product_id }, body: { variant: data }, user, shop }),
    method    : 'post',
    url       : 'admin/products/{product_id}/variants.json',
    resPath   : 'body.variant'
  },
  UPDATE : {
    transform : ({ variant_id, data, user, shop }) => Object({ body : { variant: data }, params: { variant_id }, user, shop }),
    method    : 'put',
    url       : 'admin/variants/{variant_id}.json',
    resPath   : 'body.variant'
  },
  DELETE: {
    transform : ({ product_id, variant_id, user, shop }) => Object({ params : { product_id, variant_id }, user, shop }),
    method    : 'delete',
    url       : 'admin/products/{product_id}/variants/{variant_id}.json',
    resPath   : 'body'
  }
};

HR.INVENTORY_LOCATION_BALANCE = {
  COUNT : {
    method    : 'get',
    url       : 'admin/inventorylocationbalance/count.json',
    resPath   : 'body.count'
  },
  LIST_ID : {
    method    : 'get',
    url       : 'admin/inventorylocationbalance/listids.json',
    resPath   : 'body.inventorybalanceids',
    simple_data : {
      query : {
        from_id : 0,
        to_id   : 0,
        limit   : 100,
        offset  : 1,
      }
    }
  },
  DETAIL : {
    method  : 'get',
    url     : 'admin/inventorylocationbalance/detail/{id}.json',
    resPath : 'body.inventorylocationbalance'
  }
};

HR.INVENTORY = {
  UPDATE : {
    method: 'post',
    url: 'admin/inventories/adjustorset.json',
    resPath: 'body.inventory'
  },
  ADJUSTOR_SET : {
    CREATE : {
      method  : 'post',
      url     : 'admin/inventories/adjustorset.json',
      resPath : 'body.inventory',
      simple_data : {
        "inventory": {
          "location_id": "482663",
          "type": "adjust",
          "reason": "newproduct",
          "note": "Điều chỉnh số lượng nhập kho khi hủy nhập kho của đơn hàng #108663",
          "line_items": [
            {
              "product_id": 10000434723,
              "product_variant_id": 101345186,
              "quantity": -10
            }
          ]
        }
      }
    },
  }
};

HR.CUSTOMER = {
  GROUP : {
    LIST : {
      method  : 'get',
      url     : 'admin/customers/groups.json',
      resPath : 'body.customer_groups'
    }
  },
  COUNT : {
    method    : 'get',
    url       : 'admin/customers/count.json',
    resPath   : 'body.count'
  },
  FIND : {
    method    : 'get',
    url       : 'admin/customers.json',
    resPath   : 'body.customers'
  },
  GET: {
    transform : ({ customer_id, user, shop }) => Object({ params : { customer_id }, user, shop }),
    method    : 'get',
    url       : 'admin/customers/{customer_id}.json',
    resPath   : 'body.customer'
  },
  CREATE: {
    transform : ({ data, user, shop }) => Object({ body: { customer: data }, user, shop }),
    method    : 'post',
    url       : 'admin/customers.json',
    resPath   : 'body.customer'
  },
  UPDATE: {
    transform : ({ customer_id, data, user, shop }) => Object({ params : { customer_id }, body: { customer: data }, user, shop }),
    method    : 'put',
    url       : 'admin/customers/{customer_id}.json',
    resPath   : 'body.customer'
  },
  DELETE: {
    transform: ({ customer_id, user, shop }) => Object({ params: { customer_id }, user, shop }),
    method: 'delete',
    url: 'admin/customers/{customer_id}.json',
    resPath: 'body'
  },
  ADDRESS: {
    CREATE: {
      transform : ({ customer_id, data, user, shop }) => Object({ params : { customer_id }, body: { address: data }, user, shop }),
      method    : 'post',
      url       : 'admin/customers/{customer_id}/addresses.json',
      resPath   : 'body.address'
    },
    UPDATE: {
      transform : ({ customer_id, address_id, data, user, shop }) => Object({ params : { customer_id, address_id }, body: { address: data }, user, shop }),
      method    : 'put',
      url       : 'admin/customers/{customer_id}/addresses/{address_id}.json',
      resPath   : 'body.address'
    },
    SET_DEFAULT: {
      transform: ({ customer_id, address_id, shop }) => Object({ params: { customer_id, address_id }, shop }),
      method: 'put',
      url: 'admin/customers/{customer_id}/addresses/{address_id}/default.json',
      resPath: 'body.address'
    }
  }
};

HR.PROMOTION = {
  SAME_PRICE : {
    CREATE : {
      method  : 'post',
      url     : 'admin/promotions.json',
      resPath : 'body.promotion'
    },
    DELETE : {
      method  : 'delete',
      url     : 'admin/promotions/{id}.json',
      resPath : 'body'
    }
  }
}

HR.DISCOUNT = {
  FIND : {
    transform   : ({ query, user, shop }) => Object({ query , user, shop }),
    method      : 'get',
    url         : 'admin/discounts.json',
    resPath     : 'body.discounts',
  },
  GET : {
    transform   : ({ discount_id, user, shop }) => Object({ params : { discount_id }, user, shop }),
    method      : 'get',
    url         : 'admin/discounts/{discount_id}.json',
    resPath     : 'body.discount',
  },
  CREATE : {
    transform : ({ data, user, shop }) => Object({ body: { discount: data }, user, shop }),
    method  : 'post',
    url     : 'admin/discounts.json',
    resPath : 'body.discount'
  },
  SEARCH_BY_CODE : {
    transform : ({ code, user, shop }) => Object({ query: { code }, user, shop }),
    method  : 'get',
    url     : 'admin/discounts.json',
    resPath : 'body.discounts'
  }
}

HR.COUNTRY = {
  LIST: {
    method  : 'get',
    url     : 'admin/countries.json',
    resPath : 'body.countries'
  }
};

HR.CARRIER_SERVICES = {
  LIST: {
    method : 'get',
    url : 'admin/carrier_services/config.json',
    resPath : 'body.carrier_services'
  },
  GET_SHIPPING_FEES: {
    transform: ({ data, user, shop }) => {
      const {
        carrier_service_id,
        location_id,
        to_district_code,
        to_province_code,
        cod_amount,
        total_weight,
        to_ward_code,
        to_address,
      } = data;
      const obj = Object({
        user, shop,
        params: { carrier_service_id },
        query: {
          location_id,
          to_district_code,
          to_province_code,
          to_ward_code,
          to_address,
          transport_type: 1
        }
      });
      if (cod_amount) obj.query.cod_amount = cod_amount;
      if (total_weight) obj.query.total_weight = total_weight;
      if (to_address) obj.query.to_address = to_address;
      return obj;
    },
    method: 'get',
    url: 'admin/carrier_services/{carrier_service_id}/shipping_fees.json',
    resPath: 'body.packages',
  }
};

// -------------------- HOOKS ------------------------
function setHrHeader(it) {
  if (typeof it.finalConfig.headers !== 'object') {
    it.finalConfig.headers = {};
  }

  if (it.data.user && it.data.user.HrApiConfig) {
    it.finalConfig.baseUrl = it.data.user.HrApiConfig.protocol + it.data.user.HrApiConfig.shop;
    it.finalConfig.headers['Authorization'] = `Bearer ${it.data.user.HrApiConfig.access_token}`;
  }
  else if (it.data.shop && typeof it.data.shop === 'object') {
    it.finalConfig.baseUrl = it.data.shop.haravan_settings.myharavan_domain;
    it.finalConfig.headers['Authorization'] = `Bearer ${it.data.shop.authorize.access_token}`;
  }
  else {
    throw new ERR({ message : 'Call seller api require user with HrApiConfig or shop' });
  }

  it.finalConfig.headers['accept']        = '*/*';
  it.finalConfig.headers['Content-Type']  = 'application/json';
}

function handler(it) {
  let error = ApiUtils.pickErrorData({ it });
  throw error;
}

injectConfig({ service : HR, config : { json : true, before : setHrHeader, handler : handler, isRetry : _is.retry } });
// ----------------- END HOOKS ------------------------

module.exports = { HR };