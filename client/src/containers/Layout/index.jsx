/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Layout} from 'antd';
import BlockUi from 'react-block-ui';
import RouteList from '../../views/Admin/routes';


const {Header, Content} = Layout;
function LayoutContainer(props) {
  // const owner = localStorage.getItem('me');
  function getTokenFromPath() {
    const url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    console.log(searchParams.get('token'))
    // let token = getTokenFromPath();
    let token = searchParams.get('token')
    localStorage.setItem('AccessToken', token);
    return searchParams.get('token');
  }
  return (
    <BrowserRouter>
      <BlockUi tag="div">
        <Layout className='layout-container'>
          <Layout className='ui-main'>
            <Header style={{background: '#f0f2f5', padding: 0}}>
            </Header>
            <Content className="layout-content">
              <Switch>
                  {RouteList.map((props, index) => <Route key={index} {...props} />)}
                  {/* <Route exact path={'/'} component={NoMatch}/> */}
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </BlockUi>
    </BrowserRouter>

  );
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(LayoutContainer);
