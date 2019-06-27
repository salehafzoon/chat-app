import React from 'react';
import './App.css';
import Login from '../user/login/Login'
import { Layout, notification} from 'antd';
const { Content } = Layout;

function App() {
  return (
    <Layout className="app-container">
      <Content className="app-content">
        <div className="container">
          
          <Login />

        </div>
      </Content>
    </Layout>
  );
}

export default App;
