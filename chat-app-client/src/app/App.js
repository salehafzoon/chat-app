import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

// import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

// import PollList from '../poll/PollList';
// import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
// import Profile from '../user/profile/Profile';
// import AppHeader from '../common/AppHeader';
// import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
// import PrivateRoute from '../common/PrivateRoute';

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
    this.handleLogout = this.handleLogout.bind(this);
    // this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  // loadCurrentUser() {
  //   this.setState({
  //     isLoading: true
  //   });
  //   getCurrentUser()
  //     .then(response => {
  //       this.setState({
  //         currentUser: response,
  //         isAuthenticated: true,
  //         isLoading: false
  //       });
  //     }).catch(error => {
  //       this.setState({
  //         isLoading: false
  //       });
  //     });
  // }

  componentDidMount() {
    // this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Polling App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Polling App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout className="app-container">
        <Content className="app-content">
          <div className="container">
            <Switch>

            <Route path="/ChatApp"
                render={(props) => <ChatApp {...props} />}></Route>

              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>

              <Route path="/signup"
                component={Signup}></Route>

            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
