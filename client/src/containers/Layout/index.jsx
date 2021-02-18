/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Button,
  Popover,
  message,
  List,
  Drawer,
  PageHeader,
  Tag,
  Dropdown,
  Modal,
  Upload,
  Card,
  Avatar,
} from "antd";
import "./style.css";

import * as coreActions from "../../views/Admin/Core/actions";
import * as UserActions from "../../views/Admin/User/actions";

import RouteList from "../../views/Admin/routes";
import Constants from "../../utils/constants";
import config from "../../utils/config";
import Middleware from "../Middleware/index";
import AdminServices from "../../services/adminServices";
import assetProvider from "../../utils/assetProvider";
import ApiClient from "./../../utils/apiClient";

const basedUrl = config.backend_url;
const apiUrl = `${config.backend_url}/api`;

const { Header, Content, Footer, Sider } = Layout;

const { MENU_DATA, PATHS } = Constants;
const { LOGIN_ROUTE } = PATHS;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function LayoutContainer({ CoreActions, shop, userActions, using_user }) {
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  let menuName = "Menu";

  const token = localStorage.getItem("AccessToken");
  function logout() {
    return fetch(`${basedUrl}/logout`, { method: "POST" }).then(function (res) {
      res.json().then((body) => {
        localStorage.clear();
        window.location.href = LOGIN_ROUTE;
      });
    });
  }
  let menuItems = [];
  for (let i = 0; i < MENU_DATA.length; i++) {
    const menu = MENU_DATA[i];
    if (menu.path == window.location.pathname) {
      menuName = menu.name;
    }

    if (menu.is_open) {
      menuItems.push(
        <Menu.Item key={"sub_" + menu.key} style={{ paddingLeft: 0 }}>
          <Link to={menu.path}>
            <Icon type={menu.icon} />
            <span>{menu.name}</span>
          </Link>
        </Menu.Item>
      );
    }
  }

  let user = localStorage.getItem("user");
  user = JSON.parse(user);

  function changeShop({ shop_id, user }) {
    AdminServices.changeShop({ user, shop_id })
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  let [modalUploadLogo, setModalUploadLogo] = useState(false);
  function changeLogo() {
    setModalUploadLogo(true);
  }

  const uploadSetting = {
    multiple: false,
    action: `${apiUrl}/images`,
    headers: ApiClient.getHeader(),
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onSuccess: async function (result) {
      if (result && result.image) {
        await AdminServices.Shop.update({
          id: shop.id,
          logo_src: result.image.src,
        });
      }
      CoreActions.getShop();
      setModalUploadLogo(false);
    },
  };

  useEffect(() => {
    if (token) {
      console.log(user);
      CoreActions.usingUser(user.id);
      CoreActions.getShop();
    }
  }, []);

  function LeftMenu(props) {
    return (
      <div style={{ display: props.display }}>
        {token && (
          <Sider
            collapsible={!isMobile()}
            style={{ width: "100%" }}
            defaultCollapsed={false}
            style={{ background: "#fff" }}
          >
            <Popover
              placement="right"
              content={
                <div>
                  <List size="small" bordered={false}>
                    {user && user.shops
                      ? user.shops.map((e) => (
                          <List.Item key={e.id}>
                            <a
                              key={e.id}
                              onClick={() =>
                                changeShop({
                                  user: { email: user.email },
                                  shop_id: e.id,
                                })
                              }
                            >
                              {e.id} - {e.name}
                            </a>
                          </List.Item>
                        ))
                      : null}
                    <List.Item key={"change_logo"}>
                      <a onClick={() => changeLogo()}>Đổi logo cửa hàng</a>
                    </List.Item>
                    <List.Item key={"logout"}>
                      <a onClick={() => logout()}>Đăng xuất </a>
                    </List.Item>
                  </List>
                </div>
              }
              trigger="click"
            >
              <img
                src={shop.logo_src || assetProvider.puma}
                style={{ maxWidth: "80px" }}
              />
            </Popover>

            <Menu theme="light" mode="inline">
              {menuItems}
            </Menu>
          </Sider>
        )}
      </div>
    );
  }

  let _display = (boolean) => (boolean ? "block" : "none");

  return (
    <BrowserRouter>
      <Drawer
        placement={"left"}
        closable={false}
        onClose={() => {
          setIsShowDrawer(false);
        }}
        visible={isShowDrawer && isMobile()}
        bodyStyle={{ padding: 0 }}
      >
        <LeftMenu display={_display(isMobile())} />
      </Drawer>

      <Layout style={{ background: "#fff" }}>
        <LeftMenu display={_display(!isMobile())} />
        <Layout.Content style={{ padding: "0 5px" }}>
          <PageHeader
            title={
              <Button
                key="open_menu"
                onClick={() => setIsShowDrawer(true)}
                style={{ border: "none", padding: 10 }}
                size="large"
                icon="menu"
              >
                {menuName}
              </Button>
            }
            style={{ padding: 0, display: _display(isMobile() && !!token) }}
          ></PageHeader>
          <PageHeader
            className="m-t-10 m-b-20"
            extra={[
              <Popover
                // placement="right"
                content={
                  <div>
                    <List size="small" bordered={false}>
                      {user && user.shops
                        ? user.shops.map((e) => (
                            <List.Item key={e.id}>
                              <a
                                key={e.id}
                                onClick={() =>
                                  changeShop({
                                    user: { email: user.email },
                                    shop_id: e.id,
                                  })
                                }
                              >
                                {e.id} - {e.name}
                              </a>
                            </List.Item>
                          ))
                        : null}
                      <List.Item key={"change_logo"}>
                        <a onClick={() => changeLogo()}>Đổi logo cửa hàng</a>
                      </List.Item>
                      <List.Item key={"logout"}>
                        <a onClick={() => logout()}>Đăng xuất </a>
                      </List.Item>
                    </List>
                  </div>
                }
                trigger="click"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#7265e6",
                        verticalAlign: "middle",
                        margin: 0,
                      }}
                      // shape="square"
                      size={45}
                    >
                      {using_user.first_name}
                    </Avatar>
                  }
                  title={
                    <span>
                      {[using_user.first_name, using_user.last_name].join(" ")}
                    </span>
                  }
                  description={
                    <span>
                      <Icon type="mail" /> {using_user.email}
                    </span>
                  }
                />
              </Popover>,
            ]}
            style={{ padding: 0, display: _display(!isMobile() && !!token) }}
          />
          <Switch>
            <Middleware>
              {RouteList.map((props, index) => (
                <Route key={index} {...props} />
              ))}
            </Middleware>
          </Switch>
        </Layout.Content>
      </Layout>
      <Modal
        title="Import "
        visible={modalUploadLogo}
        onCancel={() => setModalUploadLogo(false)}
      >
        <Upload.Dragger {...uploadSetting}>
          <div style={{ width: "100%" }}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </div>
        </Upload.Dragger>
      </Modal>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  using_user: state.core.get("using_user"),
  shop: state.core.get("shop"),
});

const mapDispatchToProps = (dispatch) => ({
  CoreActions: bindActionCreators(coreActions, dispatch),
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer);
