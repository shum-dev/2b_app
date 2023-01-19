import React, { useEffect, useState } from 'react';
import {
  Button, Form, Input, Radio, Select, Spin, message,
} from 'antd';
import uniqid from 'uniqid';

import { getComponents, createPizza } from '../api/pizzas';

const CreatePizza = () => {
  const [form] = Form.useForm();
  const [inLoad, setInLoad] = useState(true);
  const [data, setData] = useState({ pasteries: [], ingredients: [] });

  useEffect(() => {
    getComponents()
      .then((res) => {
        setData(res.data);
        setInLoad(false);
      })
      .catch((err) => console.log('Error: ', err));
  }, []);

  return (
    <Spin spinning={inLoad}>
      <Form
        form={form}
        onFinish={(fields) => {
          createPizza(fields)
            .then(() => {
              message.success('Pizza created');
              form.resetFields();
            })
            .catch((e) => message.error(e.message));
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Required' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Pastry"
          name="pastry"
          rules={[
            { required: true, message: 'Required' },
          ]}
        >
          <Radio.Group>
            {data.pasteries.map((item) => (
              <Radio.Button key={uniqid.time()} value={item.name}>{item.name}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="ingredients"
          label="Ingredients"
          rules={[{ required: true, message: 'Required', type: 'array' }]}
        >
          <Select mode="multiple" placeholder="Select your favorite">
            {data.ingredients.map((item) => (
              <Select.Option key={uniqid.time()} value={item.name}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CreatePizza;
