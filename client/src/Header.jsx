import React, { useState, useEffect, useContext } from 'react';
import {
  Layout, Menu, Button, message,
} from 'antd';
import { Link, useLocation, useHistory } from 'react-router-dom';

import { AuthContext } from './contexts/AuthContext';
import { logOut } from './api/user';
import { setTokenHeader } from './api/index';

import './styles/App.css';

const keys = {
  '/': '1',
  '/pizzas/create': '2',
  '/pizzas': '3',
  '/login': '4',
};

export const Header = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [selected, setSelected] = useState(() => [keys[pathname]]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    setSelected([keys[pathname]]);
  }, [pathname]);

  return (
    <Layout.Header>
      <div className="App-logo" />
      <Menu theme="dark" mode="horizontal" selectedKeys={selected}>
        <Menu.Item key="1">
          <Link to="/">Главная</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/pizzas/create">Создать пиццу</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/pizzas">Список пицц</Link>
        </Menu.Item>
        {user ? (
          <Menu.Item key="5">
            <Button
              type="text"
              danger
              onClick={() => {
                logOut()
                  .then(({ data }) => {
                    if (data.success) {
                      setUser(null);
                      setTokenHeader();
                      history.push('/');
                    }
                  })
                  .catch((e) => message.error(e.message));
              }}
            >
              Выйти
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Item key="4">
            <Link to="/login">Войти</Link>
          </Menu.Item>
        )}
        {user && <span>{user.email}</span>}
      </Menu>
    </Layout.Header>
  );
};
