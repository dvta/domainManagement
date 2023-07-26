import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Col, Divider, Layout, List, Menu, Row, Space, Table, theme} from 'antd';
import {
  EditOutlined,
  InboxOutlined, MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined, ProfileFilled, ProfileOutlined, SendOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {Link, useParams} from "react-router-dom";
import Meta from "antd/es/card/Meta.js";

const {Header, Footer, Sider, Content} = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
export default function () {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [openEmail, setOpenEmail] = useState({});

  const {type} = useParams();
  const {
    token: {colorBgContainer},
  } = theme.useToken();
  console.log(data[0]?.body);

  const [menuItems, setMenuItems] = useState([]);
  const [emailTypes, setEmailTypes] = useState([]);

  useEffect(() => {
    axios.get('/api/user/emails/filters').then((res) => {
      if (res.status === 200) {
        setEmailTypes(res.data.emailTypes)
        let items = res.data.emailTypes.map((item) => {
          return {
            key: item.id,
            icon: <InboxOutlined/>,
            label: <Link to={`/email/${item.id}`} onClick={() => setOpenEmail([])}>{item.name}</Link>,
          }
        });
        setMenuItems(items);
      }
    })
  }, [])


  useEffect(() => {
    axios.get('/api/user/emails', {
      params: {type}
    }).then(res => {
      setData(res.data)
    })
  }, [type]);

  return (
    <Layout style={
      {
        minHeight: "100vh",
      }
    }
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <MailOutlined style={{
          fontSize: 70,
          color: '#fff',
        }}/>
        {(menuItems.length > 0) &&
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[(type || menuItems[0].key).toString()]}
            items={menuItems}
          />
        }

      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            minHeight: 280,
            background: colorBgContainer,
            border: '1px solid #ccc',
          }}
        >
          <Row>
            <Col span={openEmail?.to ? 6 : 24}>
              <Card title={emailTypes.find((item) => item.id === parseInt(type))?.name || emailTypes[0]?.name}
                    bodyStyle={{
                      padding: 0,
                      minHeight: "100vh",
                    }}
                    headStyle={{
                      margin: 0
                    }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(email) => (
                    <Card
                      headStyle={{
                        padding: 5
                      }}
                      bodyStyle={{
                        padding: 5
                      }}
                      style={{
                        marginTop: 5
                      }}
                      type="inner"
                      title={
                        <div
                          onClick={() => setOpenEmail(email)}
                          style={{cursor: 'pointer'}}>
                          <Avatar
                            style={{
                              marginRight: 4
                            }}
                            src={"https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"}
                          />
                          {email.from_full_name}
                        </div>
                    }
                      description={email?.subject}
                    >
                      {email?.subject}
                    </Card>
                  )}
                />
              </Card>

            </Col>
            {
              openEmail && (
                <Col span={18}>
                  <Card
                    style={{
                      paddingLeft: 5,
                      marginLeft :5
                    }}
                    title={
                    <Meta
                      style={{
                        width: 300,
                        marginTop: 16,
                      }}
                      avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"/>}
                      title={
                        <p>
                          From: {openEmail?.from_full_name}
                        </p>
                      }

                      description={
                        <p>
                          To: {openEmail?.to}
                        </p>
                      }
                    />
                  }
                        bodyStyle={{
                          padding: 0,
                          minHeight: "100vh",
                        }}
                        headStyle={{
                          margin: 0
                        }}
                  >
                    <p dangerouslySetInnerHTML={{__html: openEmail.body}}>

                    </p>
                  </Card>
                </Col>
              )
            }
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}

