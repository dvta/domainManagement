import {Alert, Button, Card, Checkbox, Form, Input, Radio, Select, Switch} from 'antd';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Password from "antd/es/input/Password.js";


export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    axios.get('/api/domains').then(res => {
      setDomains(res.data.data)
      setLoading(false)
    })
  }, []);


  const onFinish = (values) => {
    console.log('Success:', values);
    setLoading(true)
    axios.post('/api/redirects', values).then((res) => {
      setLoading(false);
      if (res.data.result === 'success') {
        navigate('/redirects')
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
  return <Card title="Add Redirect">
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
            message: 'Please select domain!',
          }
        ]}
        validateStatus={validationErrors.domain && 'error'}
        help={validationErrors.domain && validationErrors.domain[0]}
      >
        <Select placeholder="Please select Domain"
                loading={domains.length === 0}
                showSearch={true}
        >
          {domains?.map((domain, key) => (
            <Select.Option key={key} value={domain.domain}>
              {domain.domain}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
      >
        <Radio.Group name="type" defaultValue="301">
          <Radio value="301">301</Radio>
          <Radio value="302">302</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Destination"
        name="destination"
        rules={[
          {
            required: true,
            message: 'Please input destination!',
          }
        ]}
        validateStatus={validationErrors.destination && 'error'}
        help={validationErrors.destination && validationErrors.destination[0]}
      >
        <Input placeholder="Destiantion Full Url"/>
      </Form.Item>

      <Form.Item
        label="Source"
        name="source"
        validateStatus={validationErrors.source && 'error'}
        help={validationErrors.source && validationErrors.source[0]}
      >
        <Input placeholder="Source"/>
      </Form.Item>

      <Form.Item
        label="Wildcard"
        name="wildcard"
        valuePropName="checked"
      >
        <Switch/>
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
