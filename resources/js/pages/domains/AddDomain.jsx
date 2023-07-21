import {Alert, Button, Card, Checkbox, Form, Input} from 'antd';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Password from "antd/es/input/Password.js";


export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);

  const onFinish = (values) => {
    setLoading(true)
    values.path = values.domain;
    axios.post('/api/domains', values).then((res) => {
      setLoading(false);
      if (res.data.result === 'success') {
        navigate('/domains')
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
  return <Card title="Add Domain">
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
        label="Domain"
        name="domain"
        rules={[
            {
              required: true,
              message: 'Please input your domain!',
            },
        ]}
        validateStatus={validationErrors.domain && 'error'}
        help={validationErrors.domain && validationErrors.domain[0]}
      >
        <Input placeholder='domain.com'/>
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
