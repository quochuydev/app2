import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './print.css';
import common from '../../../utils/common';

let formatMoney = common.formatMoney;
let formatFinancialStatus = common.formatFinancialStatus;

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PrintOrder);

function PrintOrder(props) {
  let { order } = props;
  return (
    <div id="print-default" className="page-break">
      <div className="printorder">
        <div className="table-brand">
          {/* <div className="col-flex" style={{ textAlign: 'left' }}>
            <img className="barcode_container_$index + 1" src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
          </div>
          <div className="col-flex" style={{ textAlign: 'center' }}>
            <img className="icon_logo" width="160px" height="70px" src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
          </div>
          <div className="col-flex" style={{ textAlign: 'right' }}>
            <img className="etp_barcode_container_$index + 1" src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
          </div> */}
        </div>
        <div className="printtable" style={{ borderBottom: '1px solid #B7B7B7' }}>
          <div className="printrow">
            <div className="printcol" style={{ width: '30%', textAlign: 'center' }}>
              <img style={{ padding: '3px 5px', minWidth: '70px', minHeight: '60px', maxWidth: '140px', maxHeight: '120px' }}
                src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
            </div>
            <div className="printcol last" style={{ borderLeft: 'none', backgroundColor: 'transparent' }}>
              <h4 style={{ margin: '0 0 5px' }}>Ngày đặt hàng: <span style={{ fontWeight: 'normal' }}> {order.created_at} </span></h4>
              <h4 style={{ margin: '0 0 5px' }}>Mã đơn hàng: <span style={{ fontWeight: 'normal' }}> {order.order_number} </span></h4>
              <h4 style={{ margin: '0 0 5px' }}>Chi nhánh: <span style={{ fontWeight: 'normal' }}> {order.pos_name} </span>
              </h4>
              <h4 style={{ margin: '0 0 3mm' }}>Địa chỉ chi nhánh: <span style={{ fontWeight: 'normal' }}> formatStoreAddress</span></h4>
              <h4 style={{ margin: '0 0 5px', textTransform: 'uppercase' }}>THÔNG TIN GIAO HÀNG</h4>
              <h4 style={{ margin: '0 0 5px' }}>Tên khách hàng: <span style={{ fontWeight: 'normal' }} ng-bind-html="joinArray([order.shipping_address.last_name, order.shipping_address.first_name])" />
              </h4>
              <h4 style={{ margin: '0 0 5px' }}>Địa chỉ: <span style={{ fontWeight: 'normal' }} ng-bind-html="renderShippingAddress( order.shipping_address )" /></h4>
              <h4 style={{ margin: '0 0 3mm' }}>Điện thoại: <span style={{ fontWeight: 'normal' }}> order.shipping_address.phone </span></h4>
              <h4 style={{ margin: '0 0 5px' }}>Đơn vị vận chuyển: <span style={{ wordBreak: 'break-all', fontWeight: 'bold' }}> order.fulfillments[0].tracking_company.toLowerCase() == 'khác' ? 'Maison' : order.fulfillments[0].tracking_company </span>
              </h4>
              <h4 style={{ margin: '0 0 10px' }}>Mã vận đơn: <span style={{ fontWeight: 'normal' }}> order.fulfillments[0].tracking_number </span></h4>
            </div>
          </div>
          <table className="table-line_items">
            <tbody>
              <tr>
                <th style={{ width: '32%' }}>THÔNG TIN SẢN PHẨM</th>
                <th style={{ width: '15%' }}>BARCODE</th>
                <th className="text-right" style={{ width: '15%' }}>SỐ LƯỢNG</th>
                <th className="text-right" style={{ width: '15%' }}>ĐƠN GIÁ</th>
                <th className="text-right" style={{ width: '20%' }}>THÀNH TIỀN</th>
              </tr>
              {
                order.line_items.map((line, index) =>
                  <tr key={index}>
                    <td style={{ width: '32%' }}>
                      <strong><span className="wordwrap">[{line.vendor}]-</span></strong>{line.title}<span>-{line.variant_title}</span>
                    </td>
                    <td style={{ width: '15%' }}> {line.barcode} </td>
                    <td className="text-right" style={{ width: '15%' }}> {line.quantity} </td>
                    <td className="text-right" style={{ width: '15%' }}>
                      <p className="text-linethrough">
                        {formatMoney(line.price)}
                      </p>
                      <p className="text-linethrough">
                        {formatMoney(line.price)}
                      </p>
                      {formatMoney(line.price)}
                    </td>
                    <td className="text-right" style={{ width: '20%' }}> {formatMoney(line.quantity * line.price)}</td>
                  </tr>
                )
              }
            </tbody>
          </table>
          <table className="with-100 border-b border-l border-r" style={{ fontSize: 'inherit' }}>
            <tbody><tr className="vertical-align-top">
              <td style={{ width: '62%' }}>
                <table className="table-height-sm" style={{ fontSize: 'inherit' }}>
                  <tbody><tr>
                    <td><strong>Hình thức thanh toán:</strong> {order.gateway}</td>
                  </tr>
                    <tr>
                      <td><strong>Tình trạng thanh toán:</strong>{formatFinancialStatus(order.financial_status)}</td>
                    </tr>
                    <tr>
                      <td><strong>GHI CHÚ:</strong> {order.note}</td>
                    </tr>
                  </tbody></table>
              </td>
              <td style={{}}>
                <table className="with-100 vertical-align-top table-height-sm" style={{ borderCollapse: 'collapse', fontSize: 'inherit' }}>
                  <tbody><tr>
                    <td className="text-left text-bold">Tổng tiền sản phẩm</td>
                    <td className="text-right"> {formatMoney(order.total_line_items_price)} </td>
                  </tr>
                    <tr>
                      <td className="text-left text-bold">Khuyến mãi</td>
                      <td className="text-right">{formatMoney(order.total_discounts)}</td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <p className="text-bold" style={{ margin: '0px' }}>Phí vận chuyển</p>
                        <p style={{ fontStyle: 'italic', margin: '0px' }}>
                          <span>(order.shipping_lines[0].title )</span>
                        </p>
                      </td>
                      <td className="text-right">
                        <span>
                          order.shipping_lines[0].price | formatMoney
                          </span>
                        <span>0</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left text-bold">Tổng thanh toán</td>
                      <td className="text-right">{formatMoney(order.total_price)}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="text-left text-bold" style={{ paddingTop: '10px' }}>Đã thanh toán</td>
                      <td className="text-right" style={{ paddingTop: '10px' }}>{formatMoney(order.custom_total_paid)}</td>
                    </tr>
                    <tr>
                      <td className="text-left text-bold">CÒN LẠI</td>
                      <td className="text-right">{formatMoney(order.total_price - order.custom_total_paid)}</td>
                    </tr>
                  </tbody></table>
              </td>
            </tr>
            </tbody></table>
          <div className="printrow">
            <div className="printcol last" style={{ backgroundColor: '#B9B9B9' }}>
              <p style={{ margin: '0 0 0 10px' }}>Cảm ơn quý khách đã sử dụng dịch vụ của Maison Online!</p>
              <p style={{ margin: '0 0 0 10px' }}>Nếu quý khách cần hỗ trợ, vui lòng liên hệ đến bộ phận chăm sóc Khách hàng</p>
              <div style={{ margin: '10px 0 0 20px', float: 'left', fontWeight: 'bold', display: 'flex', verticalAlign: 'middle' }}>
                <div style={{ backgroundColor: '#000000', borderRadius: '50%', padding: '6px' }}>
                  <img style={{ width: '11px', height: '11px', filter: 'invert(1)' }}
                    src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
                </div>
                <span style={{ marginLeft: '5px', alignSelf: 'center' }}> Hotline: 1900252538</span>
              </div>
              <div style={{ margin: '10px 20px 0 0', float: 'right', textAlign: 'right', fontWeight: 'bold', display: 'flex', verticalAlign: 'middle' }}>
                <div style={{ backgroundColor: '#000000', borderRadius: '50%', padding: '6px' }}>
                  <img style={{ width: '11px', height: '11px', filter: 'invert(1)' }}
                    src="https://topdev.vn/blog/wp-content/uploads/2020/08/logo-new-retina.png" />
                </div>
                <span style={{ marginLeft: '5px', alignSelf: 'center' }}> customercare@maisonjsc.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}