import {Alert, Button, Card, Checkbox, Form, Input, Select} from 'antd';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";


export default function () {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get('/api/domains').then(res => {
      setDomains(res.data.data)
    })
  }, []);

  const onFinish = (values) => {
    let formData = new FormData();

    Object.entries(values).forEach(([property, value]) => {
      formData.append(`${property}`, value || '');
    });

    formData.append('domain', values.domain || '');
    formData.append("_method", "PATCH");

    setLoading(true);

    axios.post('/api/domains/update-path', formData).then((res) => {
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
  return <Card title="Edit Domain Path">
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
        label="Domain"
        name="domain"
        validateStatus={validationErrors.domain && 'error'}
        help={validationErrors.domain && validationErrors.domain[0]}
      >
        <Select placeholder="Please select Domain"
                loading={domains.length === 0}
                showSearch={true}
                onChange={(value) => {
                  let domain = domains.find((domain) => domain.domain === value);
                  form.setFieldsValue({
                    path: domain.localpath
                  })
                  }
                }
        >
          {domains?.map((domain, key) => (
            <Select.Option key={key} value={domain.domain}>
              {domain.domain}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="path"
        name="path"
        validateStatus={validationErrors.path && 'error'}
        help={validationErrors.path && validationErrors.path[0]}
      >
        <Input placeholder="Domain path"/>
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
