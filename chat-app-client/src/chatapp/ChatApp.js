import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Form, Input, Button, Icon, notification ,Layout} from 'antd';

const { Header, Footer, Sider, Content } = Layout;

export default class ChatApp extends Component {
    render() {
        return (
            <div>
            <Layout>
              <Header>Header</Header>
              <Layout>
                <Sider>Sider</Sider>
                <Content>Content</Content>
          <Sider>Sider</Sider>
                
              </Layout>
            </Layout>
        
         
          </div>
        )
    }
}
