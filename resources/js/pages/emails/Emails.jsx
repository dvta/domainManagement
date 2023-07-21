import {Button, Card, Dropdown, Menu, Modal, notification, Space, Form, Switch, Table, InputNumber} from 'antd';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {CalculatorOutlined, DeleteOutlined, EditOutlined, SettingFilled} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";


export default function () {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const EditableContext = React.createContext(null);



  const emailFilters = domains.map(email => {
    return {
      text: email.domain,
      value: email.domain,
    }
  });
  const defaultColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Domain',
      dataIndex: 'maildomain',
      filters: emailFilters,
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
      width: '10%',
    },
    {
      title: 'Total Storage (MB)',
      dataIndex: 'storage_allocated_value',
      editable: true,
      width: '10%',
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
      setEmails(res.data.data)
      setLoading(false)
    })
  }, []);

  useEffect(() => {
    axios.get('/api/domains').then(res => {
      setDomains(res.data.data)
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

  // editable logic
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                        }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });

        let formData = new FormData();

        Object.entries(values).forEach(([property, value]) => {
          formData.append(`${property}`, value || '');
        });

        formData.append('email', record.email || '');
        formData.append('quota', values.storage_allocated_value || '')
        formData.append('_method', 'PATCH');

        axios.post('/api/emails/change-quota', formData).then((res) => {
          if (res.data.result === 'success') {
            openNotificationWithIcon('success', res.data.result, res.data.data.msg);
          }
        })
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <InputNumber
            style={{
              width: 200,
            }}
            min="0"
            max="100000"
            step="10"
            stringMode
            ref={inputRef}
            onPressEnter={save}
            loading={true}
            enterButton
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );

    }
    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave = (row) => {
    const newData = [...emails];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setEmails(newData);
  };
  const components = {
    body: {
      cell: EditableCell,
      row: EditableRow,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

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
        <Table rowSelection={rowSelection}
               columns={columns}
               dataSource={emails}
               rowKey='email'
               loading={loading}
               components={components}
               rowClassName={() => 'editable-row'}
        />
      </Card>
    </>
  )
};
