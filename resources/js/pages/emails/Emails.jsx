import {Alert, Badge, Button, Card, Dropdown, Menu, Modal, notification, Space, Spin, Switch, Table} from 'antd';
import React, {useEffect, useState} from 'react';
import {CalculatorOutlined, DeleteOutlined, EditOutlined, SettingFilled} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";


export default function () {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const domainFilters = emails.map(email => {
    return {
      text: email.maildomain,
      value: email.maildomain
    }
  });
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Domain',
      dataIndex: 'maildomain',
      filters: domainFilters,
      filterSearch: true,
      onFilter: (value, record) => record.maildomain.startsWith(value),
    },
    {
      title: 'Two Factor',
      dataIndex: 'twofactor',
      render: (_, record) => {
        if (record?.twofactor) {
          return <Switch defaultChecked disabled/>;
        } else {
          return <Switch disabled/>;
        }
      },
    },
    {
      title: 'Storage Used (MB)',
      dataIndex: 'storage_used',
    },
    {
      title: 'Total Storage (MB)',
      dataIndex: 'storage_allocated_value',
    },

    {
      title: 'Action',

      dataIndex: '',
      key: 'x',
      render: (_, record) => <a><DeleteOutlined onClick={() => handleDelete(record.email)}/></a>,
    },
  ];


  useEffect(() => {
    axios.get('/api/emails').then(res => {
      console.log(res.data.data)
      setEmails(res.data.data)
      setLoading(false)
    })
  }, [])

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const [alert, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    alert[type]({
      message: message || 'Notification Title',
      description:
        description ||
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  };

  function handleDelete(email) {
    let formData = new FormData();
    formData.append('email', email || '');
    formData.append("_method", "DELETE");

    Modal.confirm({
      title: `Do you Want to delete ${email}?`,
      icon: <DeleteOutlined/>,
      content: 'all files will be deleted',
      okButtonProps: {
        danger: true,
      },
      onOk() {
        setLoading(true);
        axios.post('/api/emails', formData).then(res => {
          console.log(res.data)
          if (res.data.result === 'success') {
            setEmails(emails.filter((item) => item.email !== email))
            openNotificationWithIcon('success', res.data.result, res.data.data.msg);
          } else {
            openNotificationWithIcon('error', 'Domain Not Deleted');
          }
          setLoading(false);
        })
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  }


  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 === 0;

          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            return index % 2 !== 0;

          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return (
    <>
      <Card title="Emails" extra={
        <Space>
          <Button type="primary" onClick={() => navigate('/emails/create')}>Add Email</Button>
          <Dropdown overlay={
            <Menu style={
              {
                width: 250
              }
            }>
              <Menu.Item key="1"><Link to={'/emails/change-quota'}/>
                <CalculatorOutlined/> Change Email Quota
              </Menu.Item>
              <Menu.Item key="2"><Link to={'/emails/change-password'}/>
                <EditOutlined/> Change Email Password
              </Menu.Item>
            </Menu>
          }>
            <Button><SettingFilled/></Button>
          </Dropdown>


        </Space>
      }>
        {contextHolder}
        <Table rowSelection={rowSelection} columns={columns} dataSource={emails} rowKey='email'
               loading={loading}
        />
      </Card>
    </>
  )
};
