import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Avatar, Input, Button, Icon, notification, Layout, Menu, List, Modal, Select } from 'antd';
import { getCurrentUser, loadUserChats, loadChatMessages, searchUser, addContact, loadUserContacts } from '../util/APIUtils'
import './ChatApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ACCESS_TOKEN } from '../constants';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

export default class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: true,
            isLoading: false,
            chats: [],
            messages: [],
            confirmLoading: false,
            newChatModalVisib: false,
            newChatName: '',
            newChatModalTitle: '',
            isChannel: false,
            addContactVisible: false,
            searchPhone: '',
            searchedUser: '',
            userFounded: false,
            conctacts: [],
            conctactNames: [],
        }

        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.loadChats = this.loadChats.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.handleNewChatOk = this.handleNewChatOk.bind(this);
        this.handleNewChatCancel = this.handleNewChatCancel.bind(this);

        this.updateChatName = this.updateChatName.bind(this);

        this.handleAddContOk = this.handleAddContOk.bind(this);
        this.handleAddContCancel = this.handleAddContCancel.bind(this);

        this.searchingUser = this.searchingUser.bind(this);
        this.loadContacts = this.loadContacts.bind(this);
        this.handleSelectContactChange = this.handleSelectContactChange.bind(this);

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
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }
    loadChatMessages(chatId) {
        loadChatMessages(chatId)
            .then(response => {
                this.setState({
                    messages: response.data.chat_messages,
                    isLoading: false
                });
                for (var message of this.state.messages) {
                    if (message.sender_id === this.state.currentUser.id)
                        message.own = true
                    else
                        message.own = null;
                    console.log(message);
                }

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
    handleNewChatOk = () => {
        this.setState({
            newChatModalVisib: false,
        });
        console.log(this.state.newChatName)
    }
    handleNewChatCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            newChatModalVisib: false,
        });
    };

    handleAddContOk = () => {
        this.setState({
            confirmLoading: true
        });
        addContact(this.state.searchedUser.id)
            .then(response => {
                notification['success']({
                    message: 'Chat App',
                    description: 'contact added',
                });
                this.setState({
                    addContactVisible: false,
                    confirmLoading: false
                });
            }).catch(error => {
                console.log("error:" + error.response.status)
                
                if (error.response.status == 400)
                    notification['info']({
                        message: 'Chat App',
                        description: error.response.data.message,
                    });
                else
                    notification['error']({
                        message: 'Chat App',
                        description: 'server problem',
                    });
                this.setState({
                    confirmLoading: false
                });
            });
    }
    handleAddContCancel = () => {
        this.setState({
            addContactVisible: false,
            searchedUser: ''
        });
    };

    loadContacts() {

        loadUserContacts()
            .then(response => {
                this.setState({
                    conctacts: response.data.contacts,
                });

                for (var contact of this.state.conctacts) {

                    this.state.conctactNames.push(<Option key={contact.id.toString(36)}>{contact.name}</Option>)
                }

                console.log(this.state.conctacts)
                console.log("names", this.state.conctactNames)

            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server problem',
                });
            });
    }

    updateChatName(event) {
        this.setState({
            newChatName: event.target.value
        });
    }

    searchingUser(phone) {
        searchUser(phone)
            .then(response => {
                this.setState({
                    searchedUser: response.data.user,
                    isLoading: false,
                    userFounded: true
                });
                console.log(this.state.searchedUser)
            }).catch(error => {
                this.setState({
                    searchedUser: '',
                    isLoading: false,
                    userFounded: false
                });
                notification['info']({
                    message: 'Chat App',
                    description: 'user not found',
                });
            });
    }

    handleSelectContactChange(value) {
        console.log(`selected ${value}`);

    }

    render() {
        var name = '';
        var phone = '';
        var email = '';
        console.log('rendering', this.state.messages)

        if (this.state.currentUser) {
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
                                        onClick={(event) => this.loadChatMessages(item.id)}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar size={45} style={{ verticalAlign: 'middle', alignSelf: 'center' }}>
                                                    <h2>{item.name[0]}</h2>
                                                </Avatar>
                                            }
                                            title={item.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sider>

                        <Content>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.messages}
                                renderItem={item => (
                                    <List.Item
                                        className={item.sender_id === this.state.currentUser.id ? 'own-mess' : 'other-mess'}
                                    >
                                        <List.Item.Meta
                                            title={<span>{item.content}</span>}
                                        />
                                    </List.Item>
                                )}
                            />
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

                                <Menu.Item key="1"
                                    onClick={(event) => this.handleLogout()}>
                                    <span>
                                        <Icon type="team" />
                                        <span>Contacts</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="2"
                                    onClick={(event) => this.setState({
                                        addContactVisible: true,
                                    })}>
                                    <span>
                                        <Icon type="user-add" />
                                        <span>Add Contact</span>
                                    </span>
                                </Menu.Item>


                                <Menu.Item
                                    onClick={(event) => {
                                        this.loadContacts();
                                        this.setState({
                                            newChatModalTitle: 'Create New Group',
                                            isChannel: false,
                                            newChatModalVisib: true,
                                        })
                                    }
                                    }
                                    key="3">
                                    <span>
                                        <Icon type="usergroup-add" />
                                        <span>New group</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item
                                    onClick={(event) => {
                                        this.loadContacts();
                                        this.setState({
                                            newChatModalTitle: 'Create New Channel',
                                            isChannel: true,
                                            newChatModalVisib: true,
                                        })
                                    }}
                                    key="4">
                                    <span>
                                        <Icon type="alert" />
                                        <span>New Chennel</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="5"
                                    onClick={(event) => this.handleLogout()}>
                                    <span>
                                        <Icon type="setting" />
                                        <span>Setting</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="6"
                                    onClick={(event) => this.handleLogout()}>
                                    <span>
                                        <Icon type="logout" />
                                        <span>Logout</span>
                                    </span>
                                </Menu.Item>

                            </Menu>
                        </Sider>

                    </Layout>

                    <Modal
                        title="Add Contact"
                        visible={this.state.addContactVisible}
                        onOk={this.handleAddContOk}
                        okText='Add Contact'
                        onCancel={this.handleAddContCancel}
                        confirmLoading={this.state.confirmLoading}
                    >

                        <Search placeholder="user phone number" onSearch={value => this.searchingUser(value)} enterButton />
                        <center>
                            <Avatar
                                visibility={this.state.userFounded ? "visible" : "hidden"}
                                size={45} style={{ verticalAlign: 'middle', alignSelf: 'center' }}>
                                <h2>{this.state.userFounded ? this.state.searchedUser.name[0] : ""}</h2>
                            </Avatar>
                            <span>{this.state.userFounded ? this.state.searchedUser.name : ''}</span>

                        </center>

                    </Modal>

                    <Modal
                        title="New Chat"
                        visible={this.state.newChatModalVisib}
                        onOk={this.handleNewChatOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleNewChatCancel}
                    >
                        <div>
                            <center><h2>{this.state.newChatModalTitle}</h2></center>
                            <Input value={this.state.newChatName} onChange={this.updateChatName}
                                placeholder='Chat Name' />

                            <center><h4>{'Select contact'}</h4></center>

                            <Select
                                mode="multiple"
                                style={{ width: '60%' }}
                                placeholder="select Contact to add"
                                onChange={this.handleSelectContactChange}
                            >
                                {this.state.conctactNames}
                            </Select>,
                        </div>

                    </Modal>

                </Layout>


            </div>
        )
    }
}
