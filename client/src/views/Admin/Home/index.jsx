import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

const { Content } = Layout;

function Home(props) {
  return (
    <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
  );
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);