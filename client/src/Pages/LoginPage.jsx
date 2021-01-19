import React, { useEffect, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Form, Input, Button, message,
} from 'antd';

import { setTokenHeader } from '../api/index';
import { AuthContext } from '../contexts/AuthContext';
import * as userAPI from '../api/user';

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.error) {
      message.error(location.state.error);
    }
  }, []);

  return (
    <Form
      onFinish={(fields) => {
        userAPI.logIn(fields)
          .then(({ data }) => {
            const { authToken, info } = data;
            setTokenHeader(authToken);
            setUser(info);
            return history.push('/pizzas/create');
          })
          .catch((err) => {
            if (err?.response?.data?.error) {
              message.error(err.response.data.error);
            }
            console.log('Error: ', err);
          });
      }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Поле обязятельное' },
          { type: 'email', message: 'Неверный формат' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Поле обязятельное' },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
        <div>
          <Link to="/register">Зарегистрироваться!</Link>
        </div>

      </Form.Item>
    </Form>
  );
};

export default LoginPage;
