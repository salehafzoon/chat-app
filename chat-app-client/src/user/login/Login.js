import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

import 'antd/dist/antd.css';
import { Form, Input, Button, Icon, notification } from 'antd';

const FormItem = Form.Item;


class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
        }

        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    handleLogin() {
        notification.success({
            message: 'Polling App',
            description: "You're successfully logged in.",
        });

        this.props.history.push("/ChatApp");
    }

    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">

                <center><h1 className="app-title">Chat App</h1></center>
                <h2 className="page-title">Login</h2>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.handleLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledBtn: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            disabledBtn: true
        });

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);

                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
                        // console.log(localStorage.getItem(ACCESS_TOKEN));
                        
                        this.setState({
                            disabledBtn: false
                        });
                        this.props.onLogin();

                    }).catch(error => {
                        console.log(error.message);
                        this.setState({
                            disabledBtn: false
                        });
                    });

            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem className='login-item'>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please input your Email!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" />}
                            size="large"
                            name="email"
                            type="email"
                            placeholder="Email" />
                    )}
                </FormItem>
                <FormItem className='login-item'>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(

                        <Input
                            prefix={<Icon type="lock" />}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password" />
                    )}
                </FormItem>
                <FormItem className='login-item'>
                    <Button disabled={this.state.disabledBtn} type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;