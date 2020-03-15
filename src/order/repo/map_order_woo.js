const MapOrderWoocommerce = {
  gen(order_woo, url) {
    let order = {
      id: order_woo.id,
      code: order_woo.number,
      "billing": {
        "first_name": order_woo.billing.first_name,
        "last_name": order_woo.billing.last_name,
        "company": order_woo.billing.company,
        "address_1": order_woo.billing.address_1,
        "address_2": order_woo.billing.address_2,
        "city": order_woo.billing.city,
        "state": order_woo.billing.state,
        "country": order_woo.billing.country,
        "email": order_woo.billing.email,
        "phone": order_woo.billing.phone
      },
      "shipping": {
        "first_name": order_woo.shipping.first_name,
        "last_name": order_woo.shipping.last_name,
        "company": order_woo.shipping.company,
        "address_1": order_woo.shipping.address_1,
        "address_2": order_woo.shipping.address_2,
        "city": order_woo.shipping.city,
        "state": order_woo.shipping.state,
        "country": order_woo.shipping.country,
        "email": order_woo.billing.email,
        "phone": order_woo.billing.phone
      },
      line_items: order_woo.line_items.map(line_item => ({
        product_id: line_item.product_id,
        sku: line_item.sku,
        name: line_item.name,
        variant_id: line_item.variation_id,
        quantity: line_item.quantity,
        price: Number(line_item.price),
        total: Number(line_item.total),

      })),
      created_at: order_woo.date_created,
      currency: order_woo.currency,
      note: order_woo.customer_note,
      customer_id: order_woo.customer_id,
      url,
      detail: order_woo
    };

    return order;
  }
}

module.exports = MapOrderWoocommerce;
let order_woo = {
  "id": 576,
  "parent_id": 0,
  "status": "completed",
  "order_key": "wc_order_5br1PdsxpoLSD",
  "number": "576",
  "currency": "VND",
  "version": "3.7.0",
  "prices_include_tax": false,
  "date_created": "2020-01-11T07:11:37",
  "date_modified": "2020-01-20T03:00:53",
  "customer_id": 1,
  "discount_total": "0",
  "discount_tax": "0",
  "shipping_total": "0",
  "shipping_tax": "0",
  "cart_tax": "0",
  "total": "2000000",
  "total_tax": "0",
  "billing": {
    "first_name": "Huy",
    "last_name": "Phạm",
    "company": "QuocHuy",
    "address_1": "55a đường 2 tháng 4 Thạnh Mỹ Đơn Dương",
    "address_2": "213",
    "city": "Lâm Đồng",
    "state": "bang",
    "postcode": "660000",
    "country": "VN",
    "email": "quochuy.dev@gmail.com",
    "phone": "0382986838"
  },
  "shipping": {
    "first_name": "Huy",
    "last_name": "Phạm",
    "company": "QuocHuy",
    "address_1": "55a đường 2 tháng 4 Thạnh Mỹ Đơn Dương",
    "address_2": "213",
    "city": "Lâm Đồng",
    "state": "bang",
    "postcode": "660000",
    "country": "VN"
  },
  "payment_method": "",
  "payment_method_title": "",
  "transaction_id": "",
  "customer_ip_address": "",
  "customer_user_agent": "",
  "created_via": "admin",
  "customer_note": "ádasd",
  "date_completed": "2020-01-20T09:59:06",
  "date_paid": "2020-01-17T09:25:00",
  "cart_hash": "",
  "line_items": [
    {
      "id": 3,
      "name": "Balo laptop nam nữ cỡ lớn SID59040",
      "sku": "",
      "product_id": 67,
      "variation_id": 0,
      "quantity": 4,
      "tax_class": "",
      "price": "500000",
      "subtotal": "2000000",
      "subtotal_tax": "0",
      "total": "2000000",
      "total_tax": "0",
      "taxes": [],
      "meta": []
    }
  ],
  "tax_lines": [],
  "shipping_lines": [],
  "fee_lines": [],
  "coupon_lines": [],
  "refunds": [],
  "_links": {
    "self": [
      {
        "href": "http://localhost:8080/QH1901/wp-json/wc/v1/orders/576"
      }
    ],
    "collection": [
      {
        "href": "http://localhost:8080/QH1901/wp-json/wc/v1/orders"
      }
    ],
    "customer": [
      {
        "href": "http://localhost:8080/QH1901/wp-json/wc/v1/customers/1"
      }
    ]
  }
}
let order = MapOrderWoocommerce.gen(order_woo);
// console.log(order);