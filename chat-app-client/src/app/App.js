import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch,
  Redirect,BrowserRouter
} from 'react-router-dom';

import { ACCESS_TOKEN } from '../constants';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import LoadingIndicator from '../common/LoadingIndicator';

import { Layout, notification } from 'antd';
import ChatApp from '../chatapp/ChatApp';
const { Content } = Layout;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }


  render() {

    return (
      <Layout className="app-container">
        <Content className="app-content">
          <div className="container">
            
            <BrowserRouter>
              <Switch>
                
                <Route path="/ChatApp"
                  render={(props) => <ChatApp {...props} />}></Route>
                
                <Route path="/login"
                  render={(props) => <Login {...props} />}></Route>
                
                <Route path="/signup"
                  component={Signup}></Route>
              
              <Redirect to="/login"/>
              
              </Switch>
            </BrowserRouter>

          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
