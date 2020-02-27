const uuidv1 = require('uuid/v1');
const request = require('request');
const crypto = require('crypto');

let partnerCode = "MOMO"
let accessKey = "F8BBA842ECF85"
let serectkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

let orderInfo = "pay with MoMo"
let ngrokUrl = 'https://8e150d71.ngrok.io';
let returnUrl = `${ngrokUrl}/return_url`;
let notifyUrl = `${ngrokUrl}/notify_url`;
let amount = "50000"
let orderId = uuidv1()
let requestId = uuidv1()
let requestType = "captureMoMoWallet"
let extraData = "merchantName=;merchantId="

let rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${returnUrl}&notifyUrl=${notifyUrl}&extraData=${extraData}`;
let signature = crypto.createHmac('sha256', serectkey)
  .update(rawSignature)
  .digest('hex');

let body = JSON.stringify({ partnerCode, accessKey, requestId, amount, orderId, orderInfo, returnUrl, notifyUrl, extraData, requestType, signature })

let options = {
  url: 'https://test-payment.momo.vn/gw_payment/transactionProcessor',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  },
  body
};


let buildLinkMomoOrder = (order) => {
  return new Promise(resolve => {
    request(options, (err, res, body) => {
      if (err) { console.log(err) }
      order.momo_pay = JSON.parse(body).payUrl;
      resolve(order);
    });
  })
}

let buildLinkMomoOrders = async (orders) => {
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    await buildLinkMomoOrder(order);
  }
  return orders;
}

module.exports = { buildLinkMomoOrder, buildLinkMomoOrders }