import {Alert, Button, Card, Form, Input, InputNumber, Select, Space} from 'antd';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Password from "antd/es/input/Password.js";
import GeneratePicker from "antd/lib/date-picker/generatePicker/index.js";
import {LockOutlined, ToolFilled} from "@ant-design/icons";


export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [form] = Form.useForm();


  const suffixSelector = (
    <Form.Item name="domain" noStyle>
      <Select
        style={{
          width: 150,
        }}
        loading={domains.length === 0}
        placeholder="Select a domain"
      >

        {domains.map(domain => <Select.Option key={domain.domain}
                                              value={domain.domain}>@{domain.domain}</Select.Option>)}
      </Select>
    </Form.Item>
  );


  useEffect(() => {
    axios.get('/api/domains').then(res => {
      setDomains(res.data.data)
      setLoading(false)
    })
  }, [])


  const onFinish = (values) => {
    setLoading(true)
    axios.post('/api/emails', values).then((res) => {
      setLoading(false);
      if (res.data.result === 'success') {
        navigate('/emails')
      }
      setServerErrors(res.data)
    }).catch((err) => {
      setLoading(false);
      if (err.response.status === 422) {
        setValidationErrors(err.response.data.errors)
      }

    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const generatePassword = () => {
    let password = Math.random().toString(36).slice(-8);
    form.setFieldsValue({password: password});
    form.setFieldsValue({password_confirmation: password});
  }

  return <Card title="Add Email">
    <Form
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column'
      }}

      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      {serverErrors.result &&
        <Alert
          message={serverErrors.result === 'error' && serverErrors.message}
          type="error"
          showIcon
          closable
        />
      }

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: 'Please input donation amount!',
          },
        ]}
        validateStatus={validationErrors.email && 'error'}
        help={validationErrors.email && validationErrors.email[0]}
      >
        <Input
          placeholder='email.com'
          addonAfter={suffixSelector}
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        validateStatus={validationErrors.password && 'error'}
        help={validationErrors.password && validationErrors.password[0]}
      >
        <Password
          placeholder="Password"
          id="password"
        />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="password_confirmation"
        validateStatus={validationErrors.password_confirmation && 'error'}
        help={validationErrors.password_confirmation && validationErrors.password_confirmation[0]}
        extra={
          <Button
            style={
              {
                marginTop: 10
              }
            }
            onClick={generatePassword}
          >
            <ToolFilled/> Generate
          </Button>
        }
      >
        <Password
          placeholder="Confirm Password"
          id="password_confirmation"
        />
      </Form.Item>

      <Form.Item
        label="Quota"
        name="quota"
        validateStatus={validationErrors.quota && 'error'}
        help={validationErrors.quota && validationErrors.quota[0]}
      >
        <InputNumber
          placeholder="Quota"
          min="0"
          max="100000"
          step="10"
          addonAfter="MB"
          defaultValue={100}
          style={
            {
              width: 150
            }
          }
        />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
};
