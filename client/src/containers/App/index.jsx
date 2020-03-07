import React from 'react';
import { connect } from 'react-redux';
import Layout from '../Layout/index';
import 'antd/dist/antd.css';

function App() {
  return (
    <div>
      <Layout></Layout>
    </div>
  );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);