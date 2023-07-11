import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import {Button, Menu} from 'antd';
import {useState} from 'react';
import {useNavigate} from "react-router-dom";

const items = [
  {
    label: 'Domains',
    key: '/domains',
    icon: <AppstoreOutlined/>,
    link: '/domains',
  },
  {
    label: 'Emails',
    key: '/emails',
    icon: <MailOutlined/>,
    link: '/emails',
  },
  {
    label: 'Redirects',
    key: '/redirects',
    icon: <SettingOutlined/>,
    link: '/redirects',
  }
];
export default function () {
  const [current, setCurrent] = useState(window.location.pathname ?? '/domains');
  const navigate = useNavigate();

  console.log(current)
  const onClick = (e) => {
    setCurrent(e.key);
    navigate(e.item.props.link)
  };
  return <Menu
    style={
      {
        marginBottom: 20
      }
    }
    onClick={onClick}
    selectedKeys={[current]}
    mode="horizontal"
    items={items}
  />
};
