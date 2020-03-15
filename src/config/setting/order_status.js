module.exports = {
  order_status: [
    {
      code: 'pending',
      name: 'Chờ xử lí'
    },
    {
      code: 'processing',
      name: 'Đang xử lí'
    },
    {
      code: 'on-hold',
      name: 'On hold'
    },
    {
      code: 'completed',
      name: 'Hoàn thành'
    },
    {
      code: 'cancelled',
      name: 'Đã hủy'
    },
    {
      code: 'refunded',
      name: 'Trả hàng'
    },
    {
      code: 'failed',
      name: 'Đơn lỗi'
    },
    {
      code: 'trash',
      name: 'Đơn hàng rác'
    },
  ]
}

// Order status Woocommerce
// Options: pending, processing, on-hold, completed, cancelled, refunded, failed and trash. 
// Default is pending.