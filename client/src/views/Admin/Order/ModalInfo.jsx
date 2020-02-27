import React from 'react';
import {
  Table, Row, Col, Button, Tag, Icon, Input, Select, Form, Modal, Radio
} from 'antd';

function ModalInfo(props) {
  let { order, isShowInfoModal, setIsShowInfoModal } = props;
  
  return (
    <Modal
      title="Info Order Modal"
      visible={isShowInfoModal}
      onCancel={() => setIsShowInfoModal(false)}
    >
      <p>From: {order.url}</p>
    </Modal>
  )
}

export default ModalInfo