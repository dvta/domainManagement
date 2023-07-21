import {Breadcrumb, Layout, Menu, theme} from 'antd';
import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb.jsx";
import Navigation from "../components/Navigation.jsx";

const {Header, Content, Footer, Sider} = Layout;

export default function () {
  const {
    token: {colorBgContainer},
  } = theme.useToken();
  return (
    <Layout style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <BreadCrumb/>
      <Content
        style={{
          margin: '24px 16px 0',
          height: 'calc(100% - 48px)'
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: '5px',
            height: '100%',
          }}
        >
          <Navigation/>
          <Outlet/>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        Domain Management
      </Footer>
    </Layout>
  );
};
