import {Button, Card, Dropdown, Menu, Modal, notification, Space, Spin, Switch, Table} from 'antd';
import React, {useEffect, useState} from 'react';
import {DeleteOutlined, DownOutlined, EditOutlined, SettingFilled} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import DomainPathChangeModal from "../../components/modals/DomainPathChangeModal.jsx";


export default function () {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);


  const items = [
    {
      key: '1',
      label: (<Button
        type="ghost"
        size="small"
        onClick={() => {
          handleDropdownClick()
        }}
      >
        <EditOutlined/> Change Path
      </Button>),
    },
  ];

  function handleDropdownClick(record) {
    setOpen(true);
  }

  const columns = [
    {
      title: 'Domain',
      dataIndex: 'domain',
    },
    {
      title: 'Url',
      dataIndex: 'url',
    },
    {
      title: 'Type',
      dataIndex: 'typetxt',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
    },
    {
      title: 'Wildcard',
      dataIndex: 'wildcard',
      render: (_, record) => {
        if (record?.wildcard === 1) {
          return <Switch defaultChecked disabled/>;
        } else {
          return <Switch disabled/>;
        }
      },
    },
    {
      title: 'Action',

      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Space size="middle">
          <a>
            <DeleteOutlined onClick={() => handleDelete(record)}/>
          </a>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a>
              More <DownOutlined/>
            </a>
          </Dropdown>
        </Space>
      ),
    },
];

  useEffect(() => {
    axios.get('/api/redirects').then(res => {
      setRedirects(res.data.data)
      setLoading(false)
    })
  }, [])

  const onSelectChange = (newSelectedRowKeys) => {
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

  function handleDelete(record) {
    let formData = new FormData();

    let url = record.url.length > 1 ? '/'+record.url : record.url;
    formData.append('source', record.domain + url || '');
    formData.append("_method", "DELETE");

    Modal.confirm({
      title: `Do you Want to delete ${record.destination}?`,
      icon: <DeleteOutlined/>,
      content: 'all files will be deleted',
      okButtonProps: {
        danger: true,
      },
      onOk() {
        setLoading(true);
        axios.post('/api/redirects', formData).then(res => {
          if (res.data.result === 'success') {
            setRedirects(redirects.filter((item) => item.domain !== record.domain))
            openNotificationWithIcon('success', res.data.result, res.data.data.msg);
          } else {
            openNotificationWithIcon('error', res.data.result, res.data.message);
          }
          setLoading(false);
        })
      },
      onCancel() {
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
      <Card title="Redirects" extra={
        <Space>
          <Button type="primary" onClick={() => navigate('/redirects/create')}>Add Redirects</Button>
          <Dropdown overlay={
            <Menu style={
              {
                width: 200
              }
            }>
              <Menu.Item key="1"><Link to={'/redirects/change-path'}/><EditOutlined/> Change Domain Path</Menu.Item>
            </Menu>
          }>
            <Button><SettingFilled/></Button>
          </Dropdown>

        </Space>
      }>
        {contextHolder}
        <Table rowSelection={rowSelection} columns={columns} dataSource={redirects} rowKey='domain'
               loading={loading}
        />
      </Card>
    </>
  )
};
