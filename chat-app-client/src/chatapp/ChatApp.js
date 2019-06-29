import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Avatar, Input, Button, Icon, notification, Layout, Menu, List } from 'antd';
import { getCurrentUser, loadUserChats } from '../util/APIUtils'
import './ChatApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ACCESS_TOKEN } from '../constants';


const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: true,
            isLoading: false,
            chats: []
        }
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.loadChats = this.loadChats.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    handleLogout(redirectTo = "/login", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: 'Chat App',
            description: description,
        });
    }


    loadCurrentUser() {
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response.data.user,
                    isAuthenticated: true,
                    isLoading: false
                });
                // console.log('currentUser', this.state.currentUser);

            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }

    loadChats() {
        loadUserChats()
            .then(response => {
                this.setState({
                    chats: response.data.chats,
                    isAuthenticated: true,
                    isLoading: false
                });
                // console.log('user chats', this.state.chats);

            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }
    
    componentDidMount() {
        this.loadCurrentUser();
        this.loadChats();
    }

    render() {
        var name = '';
        var phone = '';
        var email = '';

        if (this.state.currentUser) {
            console.log('cur user in render', this.state.currentUser)
            name = this.state.currentUser.name;
            phone = this.state.currentUser.phone;
            email = this.state.currentUser.email;

        }
        return (
            <div className="container">
                <Layout className="content">
                    <Header><h2 className="app-title">Chat App</h2></Header>
                    <Layout>
                        <Sider
                            theme='light'>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.chats}
                                renderItem={item => (
                                    <List.Item
                                        onClick={(event) => console.log(item.id, 'clicked')}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar size={45} style={{ verticalAlign: 'middle', alignSelf: 'center' }}>
                                                    <h2>{item.name[0]}</h2>
                                                </Avatar>
                                            }
                                            title={item.name}
                                            description=""
                                        />
                                    </List.Item>
                                )}
                            />,
                        </Sider>

                        <Content>

                        </Content>

                        <Sider>

                            <div className="profile-pannel">
                                <span>
                                    <span>{name}</span>
                                    <Avatar size={50} style={{ backgroundColor: 'black' }} icon="user" />
                                </span>

                                <h5>{phone}</h5>
                                <h5>{email}</h5>
                            </div>

                            <Menu
                                theme='light'
                                className="command-menu">

                                <Menu.Item
                                    onClick={(event) => console.log('alert clicked')}
                                    key="1">
                                    <span>
                                        <Icon type="usergroup-add" />
                                        <span>New group</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="2">
                                    <span>
                                        <Icon type="alert" />
                                        <span>New Chennel</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="3"
                                    onClick={(event) => this.handleLogout()}>
                                    <span>
                                        <Icon type="logout" />
                                        <span>Logout</span>
                                    </span>
                                </Menu.Item>

                            </Menu>
                        </Sider>

                    </Layout>
                </Layout>


            </div>
        )
    }
}
