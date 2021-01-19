import React, { useEffect, useContext } from 'react';
import { Layout, message } from 'antd';

import { AuthContext } from './contexts/AuthContext';
import { Header } from './Header';
import { Switcher } from './Router/Switcher';
import './styles/App.css';

const { Content } = Layout;

message.config({
  top: 50,
  duration: 0.6,
});

function App() {
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    // TODO initiate user from localStorage
  }, []);
  return (
    <Layout className="App">
      <Header />
      <Content className="App-content">
        <div className="App-view">
          <Switcher />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
