import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Layout, message, Statistic, Icon, Row, Col, Card, Tabs,
  Upload, Table, Button, Avatar,
} from 'antd';
import {
  Link
} from "react-router-dom";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { bindActionCreators } from 'redux';
import moment from 'moment';

import 'antd/dist/antd.css';
import * as FileActions from './actions';

import Alert from '../../Components/Alert/index';
import LoadingPage from '../../Components/Loading/index';
import AdminServices from '../../../services/adminServices';
import assetProvider from '../../../utils/assetProvider';
import config from './../../../utils/config';
import ApiClient from './../../../utils/apiClient';

const apiUrl = `${config.backend_url}/api`;

const { Content } = Layout;
const { TabPane } = Tabs;

function Home(props) {
  let {
    files, file, images, image, actions,
  } = props;

  useEffect(() => {
    actions.loadImages();
  }, [])

  const uploadSetting = {
    multiple: false,
    action: `${apiUrl}/images`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onSuccess: async function (result) {
      actions.loadImages();
      message.success(result.message);
    }
  };

  let columns = [
    {
      key: 'image', title: 'image', width: 110, render: edit =>
        <Avatar shape="square" size={90} src={edit.src} />
    },
    {
      key: 'filename', title: 'Filename', render: edit => {
        return edit.filename
      }
    },
    {
      key: 'src', title: 'src', render: edit => {
        return edit.src
      }
    },
    {
      key: 'option', title: '', render: edit =>
        <div>
          <Button icon="close" type="danger"></Button>
        </div>
    }
  ]

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Tổng quan" key="1">
          <Row gutter={[15, 0]}>
            <Col xs={12} lg={24}>
              <Upload name="file"
                listType="picture-card"
                className="avatar-uploader"
                beforeUpload={() => { return true; }}
                fileList={[]}
                {...uploadSetting}
              >
                <div className="ant-upload-text" style={{ width: 240 }}>Upload</div>
              </Upload>

              <Table key="_id" columns={columns} dataSource={images} scroll={{ x: 1200 }} />
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div >
  );
}

const mapStateToProps = state => ({
  files: state.files.get('files'),
  file: state.files.get('file'),
  images: state.files.get('images'),
  image: state.files.get('image'),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(FileActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);