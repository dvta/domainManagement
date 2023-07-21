import React from 'react';
import {Breadcrumb, Dropdown, Select} from "antd";
import {Link, useLocation} from "react-router-dom";
import Redirects from "../pages/redirects/Redirects.jsx";
import {HomeOutlined} from "@ant-design/icons";


export default function () {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const menuItems = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          General
        </a>
      ),
    }
  ];

  return (
    <Breadcrumb style={
      {
        marginTop: 20,
        marginLeft: 20
      }
    }>
      <Breadcrumb.Item key="home">
        <Link to={'/'}><HomeOutlined /></Link>
      </Breadcrumb.Item>
      {pathSnippets.map((item, index) => {
        const routeTo = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSnippets.length - 1;
        // Capitalize first letter
        item = item.charAt(0).toUpperCase() + item.slice(1);
        // if item have - replace with space
        item = item.replace(/-/g, ' ');
        return isLast ? (
          <Breadcrumb.Item key={routeTo}>{item}</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={routeTo}>
            <Link to={routeTo}>{item}</Link>
          </Breadcrumb.Item>
        );

      })}
    </Breadcrumb>
  );


}
