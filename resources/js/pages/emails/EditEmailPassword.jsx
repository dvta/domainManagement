import {Alert, Button, Card,Form, Input, Select} from 'antd';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ToolFilled} from "@ant-design/icons";
import Password from "antd/lib/input/Password.js";


export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [form] = Form.useForm();


  useEffect(() => {
    axios.get('/api/emails').then(res => {
      setEmails(res.data.data)
    })
  }, []);
  const onFinish = (values) => {
    let formData = new FormData();

    Object.entries(values).forEach(([property, value]) => {
      formData.append(`${property}`, value || '');
    });

    formData.append('email', values.email || '');
    formData.append("_method", "PATCH");

    setLoading(true);

    axios.post('/api/emails/change-password', formData).then((res) => {
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

  const generatePassword = () => {

    let password = Math.random().toString(36).slice(-8);
    form.setFieldsValue({password: password});
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <Card title="Edit Email Passwors">
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
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
        label="Email"
        name="email"
        validateStatus={validationErrors.email && 'error'}
        help={validationErrors.email && validationErrors.email[0]}
      >
        <Select placeholder="Please select Email"
                loading={emails.length === 0}
                showSearch={true}
        >
          {emails?.map((email, key) => (
            <Select.Option key={key} value={email.email}>
              {email.email}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        validateStatus={validationErrors.password && 'error'}
        help={validationErrors.password && validationErrors.password[0]}
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
          placeholder="Password"
          id="password"
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
