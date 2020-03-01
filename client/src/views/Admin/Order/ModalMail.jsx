import React from 'react';
import _ from 'lodash';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio
} from 'antd';
const { TextArea } = Input;
const radioStyle = { display: 'block', height: '30px', lineHeight: '30px', };

function ModalInfo(props) {
  let { order, isShowSendMailModal, setIsShowSendMailModal } = props;
  
  return (
    <Modal
      title="Sendmail Order Modal"
      visible={isShowSendMailModal}
      onCancel={() => setIsShowSendMailModal(false)}
    >
      <p>Gửi mail thanh toán momo</p>
      <Radio.Group onChange={() => { }} defaultValue={1}>
        <Radio style={radioStyle} value={1}>Email bill: {_.get(order, 'billing.email')}
        </Radio>
        <Radio style={radioStyle} value={2}>Email giao hàng:: {_.get(order, 'shipping.email')}
        </Radio>
      </Radio.Group>
      <TextArea rows={5} value={'{{momo_pay_url}}'} />
    </Modal>
  )
}

export default ModalInfo