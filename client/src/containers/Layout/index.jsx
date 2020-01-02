/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import BlockUi from 'react-block-ui';
import RouteList from '../../views/Admin/routes';
import NoMatch from '../../views/NoMatch/index';
import { Layout } from 'antd';
const { Content } = Layout;

function LayoutContainer(props) {
  function getTokenFromPath() {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    let token = searchParams.get('token')
    localStorage.setItem('AccessToken', token);
    return token;
  }
  getTokenFromPath();
  return (
    <BrowserRouter>
      <BlockUi tag="div" >
        <Layout style={{ background: '#fff', padding: 0 }}>
          <Content>
            <Switch>
              {RouteList.map((props, index) => <Route key={index} {...props} />)}
              <Route exact path={'/'} component={NoMatch}/>
            </Switch>
          </Content>
        </Layout>
      </BlockUi>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(LayoutContainer);
