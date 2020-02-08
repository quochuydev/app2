const MapOrderShopify = {
  gen(order_shopify, url) {
    let order = {
      type: 'shopify',
      id: order_shopify.id,
      code: order_shopify.order_number,
      billing: {
        first_name: order_shopify.billing_address.first_name,
        last_name: order_shopify.billing_address.last_name,
        company: order_shopify.billing_address.company,
        address_1: order_shopify.billing_address.address1,
        address_2: order_shopify.billing_address.address2,
        city: order_shopify.billing_address.province,
        state: order_shopify.billing_address.district,
        country: order_shopify.billing_address.country,
        email: order_shopify.email,
        phone: order_shopify.billing_address.phone
      },
      shipping: {
        first_name: order_shopify.shipping_address.first_name,
        last_name: order_shopify.shipping_address.last_name,
        company: order_shopify.shipping_address.company,
        address_1: order_shopify.shipping_address.address1,
        address_2: order_shopify.shipping_address.address2,
        city: order_shopify.shipping_address.city,
        state: order_shopify.shipping_address.province,
        country: order_shopify.shipping_address.country,
        email: order_shopify.email,
        phone: order_shopify.shipping_address.phone
      },
      line_items: order_shopify.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.title,
        variant_id: line_item.variant_id,
        quantity: line_item.quantity,
        price: line_item.price,
        total: line_item.price * line_item.quantity,

      })),
      created_at: order_shopify.created_at,
      currency: order_shopify.currency,
      note: order_shopify.note,
      customer_id: order_shopify.customer.id,
      url,
      detail: order_shopify
    };

    return order;
  }
}

module.exports = MapOrderShopify;

let order_shopify = {
  "id": 2094676017227,
  "email": "quochuydev@gmail.com",
  "closed_at": null,
  "created_at": "2020-01-21T01:37:26-05:00",
  "updated_at": "2020-01-22T02:59:33-05:00",
  "number": 1,
  "note": "123 321",
  "token": "ba7a5a1856d228445b830d29a709a528",
  "gateway": "manual",
  "test": false,
  "total_price": "1222",
  "subtotal_price": "1111",
  "total_weight": 0,
  "total_tax": "111",
  "taxes_included": false,
  "currency": "VND",
  "financial_status": "paid",
  "confirmed": true,
  "total_discounts": "0",
  "total_line_items_price": "1111",
  "cart_token": null,
  "buyer_accepts_marketing": false,
  "name": "#1001",
  "referring_site": null,
  "landing_site": null,
  "cancelled_at": null,
  "cancel_reason": null,
  "total_price_usd": "0.05",
  "checkout_token": null,
  "reference": null,
  "user_id": 40124940363,
  "location_id": null,
  "source_identifier": null,
  "source_url": null,
  "processed_at": "2020-01-21T01:37:26-05:00",
  "device_id": null,
  "phone": "+84382986838",
  "customer_locale": null,
  "app_id": 1354745,
  "browser_ip": null,
  "landing_site_ref": null,
  "order_number": 1001,
  "discount_applications": [],
  "discount_codes": [],
  "note_attributes": [],
  "payment_gateway_names": [
      "manual"
  ],
  "processing_method": "manual",
  "checkout_id": null,
  "source_name": "shopify_draft_order",
  "fulfillment_status": null,
  "tax_lines": [
      {
          "price": "111",
          "rate": 0.1,
          "title": "VAT",
          "price_set": {
              "shop_money": {
                  "amount": "111",
                  "currency_code": "VND"
              },
              "presentment_money": {
                  "amount": "111",
                  "currency_code": "VND"
              }
          }
      }
  ],
  "tags": "",
  "contact_email": "quochuydev@gmail.com",
  "order_status_url": "https://quochuydev1.myshopify.com/28208726091/orders/ba7a5a1856d228445b830d29a709a528/authenticate?key=0c721c2903afee9771896c61168fc827",
  "presentment_currency": "VND",
  "total_line_items_price_set": {
      "shop_money": {
          "amount": "1111",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "1111",
          "currency_code": "VND"
      }
  },
  "total_discounts_set": {
      "shop_money": {
          "amount": "0",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "0",
          "currency_code": "VND"
      }
  },
  "total_shipping_price_set": {
      "shop_money": {
          "amount": "0",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "0",
          "currency_code": "VND"
      }
  },
  "subtotal_price_set": {
      "shop_money": {
          "amount": "1111",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "1111",
          "currency_code": "VND"
      }
  },
  "total_price_set": {
      "shop_money": {
          "amount": "1222",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "1222",
          "currency_code": "VND"
      }
  },
  "total_tax_set": {
      "shop_money": {
          "amount": "111",
          "currency_code": "VND"
      },
      "presentment_money": {
          "amount": "111",
          "currency_code": "VND"
      }
  },
  "line_items": [
      {
          "id": 4602072399947,
          "variant_id": 31427081240651,
          "title": "123123",
          "quantity": 1,
          "sku": "",
          "variant_title": null,
          "vendor": "quochuydev1",
          "fulfillment_service": "manual",
          "product_id": 4386442182731,
          "requires_shipping": true,
          "taxable": true,
          "gift_card": false,
          "name": "123123",
          "variant_inventory_management": "shopify",
          "properties": [],
          "product_exists": true,
          "fulfillable_quantity": 1,
          "grams": 0,
          "price": "1111",
          "total_discount": "0",
          "fulfillment_status": null,
          "price_set": {
              "shop_money": {
                  "amount": "1111",
                  "currency_code": "VND"
              },
              "presentment_money": {
                  "amount": "1111",
                  "currency_code": "VND"
              }
          },
          "total_discount_set": {
              "shop_money": {
                  "amount": "0",
                  "currency_code": "VND"
              },
              "presentment_money": {
                  "amount": "0",
                  "currency_code": "VND"
              }
          },
          "discount_allocations": [],
          "admin_graphql_api_id": "gid://shopify/LineItem/4602072399947",
          "tax_lines": [
              {
                  "title": "VAT",
                  "price": "111",
                  "rate": 0.1,
                  "price_set": {
                      "shop_money": {
                          "amount": "111",
                          "currency_code": "VND"
                      },
                      "presentment_money": {
                          "amount": "111",
                          "currency_code": "VND"
                      }
                  }
              }
          ]
      }
  ],
  "fulfillments": [],
  "refunds": [],
  "total_tip_received": "0.0",
  "admin_graphql_api_id": "gid://shopify/Order/2094676017227",
  "shipping_lines": [],
  "billing_address": {
      "first_name": "Huy",
      "address1": null,
      "phone": null,
      "city": null,
      "zip": null,
      "province": null,
      "country": "Vietnam",
      "last_name": "Pháº¡m",
      "address2": null,
      "company": null,
      "latitude": null,
      "longitude": null,
      "name": "Huy Pháº¡m",
      "country_code": "VN",
      "province_code": null
  },
  "shipping_address": {
      "first_name": "Huy",
      "address1": null,
      "phone": null,
      "city": null,
      "zip": null,
      "province": null,
      "country": "Vietnam",
      "last_name": "Pháº¡m",
      "address2": null,
      "company": null,
      "latitude": null,
      "longitude": null,
      "name": "Huy Pháº¡m",
      "country_code": "VN",
      "province_code": null
  },
  "customer": {
      "id": 2910792155211,
      "email": "quochuydev@gmail.com",
      "accepts_marketing": false,
      "created_at": "2020-01-21T01:28:56-05:00",
      "updated_at": "2020-01-22T02:59:33-05:00",
      "first_name": "Huy",
      "last_name": "Pháº¡m",
      "orders_count": 1,
      "state": "disabled",
      "total_spent": "1222.00",
      "last_order_id": 2094676017227,
      "note": null,
      "verified_email": true,
      "multipass_identifier": null,
      "tax_exempt": false,
      "phone": "+84382986838",
      "tags": "",
      "last_order_name": "#1001",
      "currency": "VND",
      "accepts_marketing_updated_at": "2020-01-21T01:28:56-05:00",
      "marketing_opt_in_level": null,
      "admin_graphql_api_id": "gid://shopify/Customer/2910792155211",
      "default_address": {
          "id": 3141282136139,
          "customer_id": 2910792155211,
          "first_name": "Huy",
          "last_name": "Pháº¡m",
          "company": "",
          "address1": "",
          "address2": "",
          "city": "",
          "province": "",
          "country": "Vietnam",
          "zip": "",
          "phone": "",
          "name": "Huy Pháº¡m",
          "province_code": null,
          "country_code": "VN",
          "country_name": "Vietnam",
          "default": true
      }
  }
}
let order = MapOrderShopify.gen(order_shopify);
// console.log(order)