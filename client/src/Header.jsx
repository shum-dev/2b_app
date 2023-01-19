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
      <div className="App-logo">
        {user && <div>{user.email}</div>}
      </div>
      <Menu theme="dark" mode="horizontal" selectedKeys={selected}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/pizzas/create">Create Pizza</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/pizzas">Pizza List</Link>
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
              Logout
            </Button>
          </Menu.Item>
        ) : (
          <Menu.Item key="4">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </Layout.Header>
  );
};
