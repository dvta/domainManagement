import {Button, Card, Dropdown, Menu, Modal, notification, Space, Spin, Switch, Table} from 'antd';
import React, {useEffect, useState} from 'react';
import {DeleteOutlined, DownOutlined, EditOutlined, SettingFilled} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import DomainPathChangeModal from "../../components/modals/DomainPathChangeModal.jsx";


export default function () {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [domains, setDomains] = useState([]);
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
      title: 'Local Path',
      dataIndex: 'localpath',
    },
    {
      title: 'Is Main',
      dataIndex: 'isMain',
      render: (_, record) => {
        if (record?.isMain) {
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
            <DeleteOutlined onClick={() => handleDelete(record.domain)}/>
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
    axios.get('/api/domains').then(res => {
      setDomains(res.data.data)
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

  function handleDelete(domain) {
    let formData = new FormData();
    formData.append('domain', domain || '');
    formData.append("_method", "DELETE");

    Modal.confirm({
      title: `Do you Want to delete ${domain}?`,
      icon: <DeleteOutlined/>,
      content: 'all files will be deleted',
      okButtonProps: {
        danger: true,
      },
      onOk() {
        setLoading(true);
        axios.post('/api/emails', formData).then(res => {
          if (res.data.result === 'success') {
            setDomains(domains.filter((item) => item.domain !== domain))
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

  //for modal
  const onCreate = (values) => {
    setOpen(false);
  };

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
      <Card title="Domains" extra={
        <Space>
          <Button type="primary" onClick={() => navigate('/domains/create')}>Add Domain</Button>
          <Dropdown overlay={
            <Menu style={
              {
                width: 200
              }
            }>
              <Menu.Item key="1"><Link to={'/domains/change-path'}/><EditOutlined/> Change Domain Path</Menu.Item>
            </Menu>
          }>
            <Button><SettingFilled/></Button>
          </Dropdown>

        </Space>
      }>
        <div>
          <DomainPathChangeModal
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }
            }
            data={selectedDomain}
            />
        </div>
        {contextHolder}
        <Table rowSelection={rowSelection} columns={columns} dataSource={domains} rowKey='domain'
               loading={loading}
        />
      </Card>
    </>
  )
};
