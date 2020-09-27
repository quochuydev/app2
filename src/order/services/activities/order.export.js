let path = require('path');
let moment = require('moment');

const { ExcelLib } = require(path.resolve('./src/core/lib/excel.lib'));

module.exports = ({ OrderModel, VariantModel, _parse, config }) => async function exportOrders({ query }) {
  let { limit, skip, criteria } = _parse(query);
  let orders = await OrderModel.find(criteria);

  const excel = await ExcelLib.init({
    host: config.app_host,
    dir: `./download/${moment().format('YYYY')}/${moment().format('MM-DD')}`,
    fileName: `export-order-{i}-${moment().utc(7).format('DD-MM-YYYY_HH-mm-ss')}.xlsx`,
    worksheet: {
      name: 'sheet1',
      columns: [
        { header: 'id', key: 'id', width: 20 },
        { header: 'Ngày tạo', key: 'created_at', width: 20 },
      ]
    },
    limit: 1000
  });

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    await excel.write({ id: order.id, created_at: order.created_at });
  }

  const { downloadLink } = await excel.end();
  console.log(downloadLink);
  return { error: false, downloadLink };
}