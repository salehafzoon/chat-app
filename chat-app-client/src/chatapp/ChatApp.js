import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Avatar, Input, Button, Icon, notification, Layout, Menu, List, Modal, Select } from 'antd';
import {
    getCurrentUser, loadUserChats, loadChatMessages, searchUser, addContact, loadUserContacts
    , createChatApi, checkIsAdmin, sendMessageApi, getChatInfo, isBlocked, blockUnblockUser
} from '../util/APIUtils'
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
            contacts: [],
            contactNames: [],
            others: [],
            selectedChatName: '',
            curChat: null,
            isAdmin: true,
            curChatInfo: null,
            privateChatModalVisib: false,
            publicChatModalVisib: false,
            isUserBlocked: false,

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

        this.sendMessage = this.sendMessage.bind(this);
        this.showChatInfo = this.showChatInfo.bind(this);

        this.handlePrivChatOk = this.handlePrivChatOk.bind(this);
        this.handlePrivChatCancel = this.handlePrivChatCancel.bind(this);

        this.blockOrUnblockUser = this.blockOrUnblockUser.bind(this);
        this.checkUserIsBloked = this.checkUserIsBloked.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });

    }
    handleLogout(redirectTo = "/login", notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState(
            null
        );

        this.props.history.replace(redirectTo);

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
    loadChatMessages(chat) {

        this.setState({
            curChat: chat
        })

        checkIsAdmin(chat.id)
            .then(response => {
                this.setState({
                    isAdmin: response.data.is_admin,
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
        this.setState({
            selectedChatName: chat.name
        })
        loadChatMessages(chat.id)
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
                    // console.log(message);
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

        let createChatRequest = {
            'name': this.state.newChatName,
            'others': this.state.others,
            'isPrivate': false,
            'isChannel': this.state.isChannel
        }
        console.log('creatChatReq', createChatRequest);

        createChatApi(createChatRequest)
            .then(response => {
                this.setState({
                    newChatName: '',
                    others: [],
                    newChatModalVisib: false,
                });
                notification['success']({
                    message: 'Chat App',
                    description: 'Chat created',
                });
                this.loadChats();

            }).catch(error => {

                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });


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

                this.loadContacts();
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
                    contacts: [],
                    contactNames: []
                })

                this.setState({
                    contacts: response.data.contacts,
                });

                for (var contact of this.state.contacts) {

                    this.state.contactNames.push(<Option key={contact.id.toString(36)}>{contact.name}</Option>)
                }

                console.log(this.state.contacts)
                console.log("names", this.state.contactNames)

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

        this.setState({
            others: value
        })
        console.log(this.state.others);
    }
    openAddContactModal() {
        this.setState({
            addContactVisible: true,
        })
    }
    openNewGroupModal() {
        this.loadContacts();
        this.setState({
            newChatModalTitle: 'Create New Group',
            isChannel: false,
            newChatModalVisib: true,
        })
    }
    openNewChannelModal() {

        this.loadContacts();
        this.setState({
            newChatModalTitle: 'Create New Channel',
            isChannel: true,
            newChatModalVisib: true,
        })
    }
    sendMessage(message) {

        console.log(message, this.state.curChat.id)

        sendMessageApi(this.state.curChat.id, message)
            .then(response => {
                this.loadChatMessages(this.state.curChat)
            }).catch(error => {

                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });

    }
    showChatInfo() {

        getChatInfo(this.state.curChat.id)
            .then(response => {
                this.setState({
                    curChatInfo: response.data.info
                })
                if (this.state.curChatInfo.is_private) {
                    for (var member of this.state.curChatInfo.members) {
                        console.log('user_id', this.state.currentUser.id)
                        if (member.id !== this.state.currentUser.id)
                            this.checkUserIsBloked(this.state.curChat.id, member.id)
                    }
                    this.setState({
                        privateChatModalVisib: true
                    })
                } else
                    this.setState({
                        publicChatModalVisib: true
                    })
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });
    }
    checkUserIsBloked(chatId, userId) {
        isBlocked(chatId, userId)
            .then(response => {
                this.setState({
                    isUserBlocked: response.data.is_blocked
                })
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });
    }
    handlePrivChatCancel() {
        this.setState({
            privateChatModalVisib: false,
        });
    }
    handlePrivChatOk() {
        this.setState({
            privateChatModalVisib: false,
        });
    }
    blockOrUnblockUser() {
        var blockId;
        var command = 'block';
        for (var member of this.state.curChatInfo.members) {
            if (member.id !== this.state.currentUser.id)
                blockId =member.id 
        }
        if(this.state.isUserBlocked)
            command = 'unblock'
        
        console.log(this.state.curChatInfo.id, blockId, command)
        
        blockUnblockUser(this.state.curChatInfo.id, blockId, command)
            .then(response => {
                if (command === 'block')
                    this.setState({
                        isUserBlocked: true
                    })
                else
                    this.setState({
                        isUserBlocked: false
                    })
                notification['success']({
                    message: 'Chat App',
                    description: 'User '+command +'ed',
                });
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });
        
    }
    render() {
        var name = '';
        var phone = '';
        var email = '';

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
                                        onClick={(event) => this.loadChatMessages(item)}>
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

                        <Content className='chat_panel'>
                            <div className='chat_title-panel'>
                                <center>
                                    <span className='chat_title'>{this.state.selectedChatName}</span>
                                    <Button type="primary" shape="circle" icon="more"
                                        onClick={this.showChatInfo} />
                                </center>
                            </div>

                            <div className='chat_view'>
                                <List
                                    className='chat-back'
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
                            </div>

                            <Search
                                className='message-inp'
                                disabled={this.state.isAdmin ? false : true}
                                placeholder="message"
                                enterButton="send"
                                onSearch={value => this.sendMessage(value)}
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
                                        <Icon type="message" />
                                        <span>New conversion</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="2"
                                    onClick={(event) => this.openAddContactModal()}>
                                    <span>
                                        <Icon type="user-add" />
                                        <span>Add Contact</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="3"
                                    onClick={(event) => this.openNewGroupModal()}>
                                    <span>
                                        <Icon type="usergroup-add" />
                                        <span>New group</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="4"
                                    onClick={(event) => this.openNewChannelModal()}>
                                    <span>
                                        <Icon type="sound" />
                                        <span>New Chennel</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="5"
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
                                <h2>{this.state.searchedUser.name !== undefined ? this.state.searchedUser.name[0] : ""}</h2>
                            </Avatar>
                            <span>{this.state.searchedUser.name !== undefined ? this.state.searchedUser.name : ''}</span>

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
                                {this.state.contactNames}
                            </Select>,
                        </div>

                    </Modal>

                    <Modal
                        title="Chat info"
                        visible={this.state.privateChatModalVisib}
                        onOk={this.handlePrivChatOk}
                        onCancel={this.handlePrivChatCancel} >
                        <div>
                            <center>
                                <Avatar
                                    size='large'>
                                    <h2>{this.state.curChatInfo != null ? this.state.curChatInfo.name[0] : ''}</h2>
                                </Avatar>
                                <h2>{this.state.curChatInfo != null ? this.state.curChatInfo.name : ''}</h2>

                                <Button type={this.state.isUserBlocked === true ? "primary" : "danger"} block
                                    onClick={this.blockOrUnblockUser}>
                                    {this.state.isUserBlocked === true ? "Unblock User" : "Block User"}
                                </Button>
                            </center>

                        </div>

                    </Modal>

                </Layout>


            </div>
        )
    }
}
