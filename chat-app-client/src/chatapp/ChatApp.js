import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Avatar, Input, Button, Icon, notification, Layout, Menu, List, Modal, Select, TreeSelect } from 'antd';
import {
    getCurrentUser, loadUserChats, loadChatMessagesApi, searchUser, addContact, loadUserContacts
    , createChatApi, checkIsAdmin, sendMessageApi, getChatInfo, blockUnblockUser, checkIsAllowed,
    checkIsBlock, uppdateChatMembers, deleteChatApi
} from '../util/APIUtils'
import './ChatApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ACCESS_TOKEN } from '../constants';
import { COLORS } from '../constants'
import { ReactIndexedDB } from 'react-indexed-db';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

const { SHOW_PARENT } = TreeSelect;


export default class ChatApp extends Component {
    constructor(props) {

        super(props);


        this.state = {
            db: null,
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
            isAdmin: false,
            isAllowed: false,
            curChatInfo: null,
            privateChatModalVisib: false,
            publicChatModalVisib: false,
            isUserBlocked: false,
            newConvModalVisib: false,
            newConvName: null,
            treeProps: {},
            newMembers: [],
            sendingMess:'',

        }

        this.db = new ReactIndexedDB('ChatAppDB', 1);


        this.db.openDatabase(1, evt => {

            console.log('creating tables')

            let objectStore = evt.currentTarget.result.createObjectStore('chats', { keyPath: 'id', autoIncrement: false });

            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('is_private', 'is_private', { unique: false });
            objectStore.createIndex('is_channel', 'is_channel', { unique: false });
            objectStore.createIndex('messeges', 'messeges', { unique: false });

        });

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

        this.openNewConvModal = this.openNewConvModal.bind(this);
        this.handleNewConvOk = this.handleNewConvOk.bind(this);
        this.handleNewConvCancel = this.handleNewConvCancel.bind(this);

        this.handlePublicChatInfoOk = this.handlePublicChatInfoOk.bind(this);
        this.handlePublicChatInfoCancel = this.handlePublicChatInfoCancel.bind(this);

        this.preparePublicModal = this.preparePublicModal.bind(this);

        this.updateChatMembers = this.updateChatMembers.bind(this);

        this.checkUserIsAdmin = this.checkUserIsAdmin.bind(this);
        this.deleteChat = this.deleteChat.bind(this);

        this.updateSendMess = this.updateSendMess.bind(this);

        
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

        checkIsAllowed(chat.id)
            .then(response => {
                this.setState({
                    isAllowed: response.data.is_allowed,
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

        // for (var message of chat.messages) {
        //     if (message.sender_id === this.state.currentUser.id)
        //         message.own = true
        //     else
        //         message.own = null;
        // }

        loadChatMessagesApi(chat.id)
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
                }

            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }
    async componentDidMount() {

        // this.db.openDatabase(1, evt => {
        //     console.log('db opend')
        //     this.db.add('chats', {
        //         name: 'chat1', is_private: true,
        //         is_channel: false,
        //         messeges: [
        //             {
        //                 "id": 6,
        //                 "content": "salam",
        //                 "sender_id": 1,
        //                 "send_date": "2019-07-01 14:31:26",
        //                 "created_at": "2019-07-01 10:01:26",
        //                 "updated_at": "2019-07-01 10:01:26",
        //                 "chat_id": 4
        //             },
        //         ]
        //     }).then(
        //         () => {
        //             console.log('adding chat to db');
        //         },
        //         error => {
        //             console.log(error);
        //         }
        //     );
        // });


        // this.db.getAll('chats').then(
        //     chats => {
        //         console.log('db chats:',chats)
        //     });


        await this.loadCurrentUser();
        await this.loadChats();
        // try {
        //     setInterval(async () => {

        //         //load datas from indexDb

        //         await this.loadCurrentUser();
        //         await this.loadChats();
        //         if (this.state.curChat != null) {
        //             await this.loadChatMessages(this.state.curChat)
        //         }

        //         console.log('update')
        //     }, 3000);
        // } catch (e) {
        //     console.log(e);
        // }

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

                console.log('geting contacts');

            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server problem',
                });
            });
    }

    updateMember = value => {
        this.setState({
            newMembers: value
        })
        console.log('onChange ', value);
    }

    checkUserIsAdmin() {
        checkIsAdmin(this.state.curChatInfo.id)
            .then(response => {

                this.setState({
                    isAdmin: response.data.is_admin,
                    publicChatModalVisib: true
                });

                console.log(this.state.isAdmin)
            }).catch(error => {

                notification['info']({
                    message: 'Chat App',
                    description: 'user not found',
                });
            });
    }

    preparePublicModal() {
        loadUserContacts()
            .then(response => {

                this.setState({
                    contacts: [],
                })

                this.setState({
                    contacts: response.data.contacts,
                });

                let values = []
                let treeData = []

                for (let member of this.state.curChatInfo.members) {
                    if (member.id !== this.state.currentUser.id)
                        values.push(member.id)

                }


                for (let contact of this.state.contacts) {
                    if (contact.id !== this.state.currentUser.id)
                        treeData.push({
                            title: contact.name,
                            value: contact.id,
                            key: contact.id
                        })
                }

                // console.log(values)
                // console.log(treeData)

                const tProps = {
                    treeData,
                    defaultValue: values,
                    onChange: this.updateMember,
                    treeCheckable: true,
                    style: {
                        width: 300,
                    },
                };

                this.setState({
                    treeProps: tProps,
                })

                //check is admin
                this.checkUserIsAdmin()

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
                console.log('searchUser', this.state.searchedUser)
                console.log('userFound', this.state.userFounded)

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
            others: value,
        })
        console.log(this.others);
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

        if (this.state.curChat == null || this.state.curChat == undefined) {
            notification['info']({
                message: 'Chat App',
                description: 'Select chat first',
            });
        } else

            getChatInfo(this.state.curChat.id)
                .then(response => {
                    this.setState({
                        curChatInfo: response.data.info
                    })

                    if (this.state.curChatInfo.is_private) {
                        for (let member of this.state.curChatInfo.members) {

                            if (member.id !== this.state.currentUser.id) {
                                this.checkUserIsBloked(this.state.curChat.id, member.id)
                                console.log('member_id', member.id, 'member_name', member.name)

                            }
                        }
                        this.setState({
                            privateChatModalVisib: true
                        })
                    } else {
                        this.preparePublicModal()
                    }
                }).catch(error => {
                    console.log(error)
                    notification['error']({
                        message: 'Chat App',
                        description: 'server has problem',
                    });
                });
    }
    checkUserIsBloked(chatId, userId) {
        checkIsBlock(chatId, userId)
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
                blockId = member.id
        }
        if (this.state.isUserBlocked)
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
                    description: 'User ' + command + 'ed',
                });
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });

    }
    openNewConvModal() {
        this.loadContacts();
        this.setState({
            newConvModalVisib: true,
            others: []
        })
    }
    handleNewConvCancel() {
        this.setState({
            newConvModalVisib: false,
            searchedUser: ''
        });
    }
    handleNewConvOk() {

        let name;

        for (var contact of this.state.contacts) {
            if (contact.id == this.state.others[0])
                name = contact.name
        }

        let creatConvReq = {
            'name': name,
            'others': this.state.others,
            'isPrivate': true,
            'isChannel': false
        }
        console.log('creatConvReq', creatConvReq);

        createChatApi(creatConvReq)
            .then(response => {
                this.setState({
                    newChatName: '',
                    others: [],
                    newConvModalVisib: false,
                });
                notification['success']({
                    message: 'Chat App',
                    description: 'Conversion created',
                });
                this.loadChats();

            }).catch(error => {

                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });

    }

    handlePublicChatInfoOk() {
        this.setState({
            publicChatModalVisib: false,
        });
    }
    handlePublicChatInfoCancel() {
        this.setState({
            publicChatModalVisib: false,
        });
    }

    updateChatMembers() {

        console.log('new members:', this.state.curChatInfo.id,
            this.state.newMembers)

        uppdateChatMembers(this.state.curChatInfo.id,
            this.state.newMembers)
            .then(response => {
                notification['success']({
                    message: 'Chat App',
                    description: 'Chat members updated',
                });

                this.setState({
                    publicChatModalVisib: false
                })
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });
    }

    deleteChat() {
        deleteChatApi(this.state.curChatInfo.id)
            .then(response => {
                notification['success']({
                    message: 'Chat App',
                    description: 'Chat deleted',
                });

                this.setState({
                    publicChatModalVisib: false
                })
                this.loadChats()
            }).catch(error => {
                notification['error']({
                    message: 'Chat App',
                    description: 'server has problem',
                });
            });

    }
    updateSendMess(message){
        this.setState({
            sendMessage:message
        })
        console.log(this.state.sendingMess)
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
                    <Header className="app-title"><h2 style={{ color: 'white' }}>Chat App</h2></Header>
                    <Layout className='layout'>

                        <Sider
                            theme='dark'>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.chats}
                                renderItem={item => (
                                    <List.Item
                                        className={'chat-item'}
                                        onClick={(event) => this.loadChatMessages(item)}>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar size={50} style={{
                                                    backgroundColor:
                                                        COLORS[Math.floor(Math.random() * Math.floor(4))]
                                                }}>
                                                    <h2 style={{ color: 'white' }}>{item.name[0]}</h2>
                                                </Avatar>
                                            }
                                            title={<h3 style={{ marginTop: 14, color: 'white', marginRight: 28 }}>{item.name}</h3>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sider>

                        <Layout style={{ position: 'relative' }}>
                            <Header style={{ backgroundColor: '#17212b', position: "fixed", width: '42.6%', zIndex: 1 }}>
                                <div>
                                    <center>
                                        <span style={{ color: "white", fontSize: 18 }}>
                                            {this.state.selectedChatName}
                                        </span>
                                        <Button style={{ float: "right", marginTop: 15 }} type="primary" shape="circle" icon="more"
                                            onClick={this.showChatInfo} />
                                    </center>
                                </div>
                            </Header>
                            <Content>

                                <div className='chat-view'>
                                    <List
                                        className='chat-back'
                                        itemLayout="horizontal"
                                        dataSource={this.state.messages}
                                        renderItem={item => (
                                            <List.Item
                                                className={this.state.currentUser !== undefined && item.sender_id === this.state.currentUser.id ? 'own-mess' : 'other-mess'}
                                            >
                                                <List.Item.Meta
                                                    title={<span>{item.content}</span>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>

                            </Content>
                            <Footer style={{ position: 'fixed', bottom: '12%', zIndex: 1, width: '42.6%' }}>
                                <div style={{ padding: 0, margin: 0, }}>
                                    <Search
                                        // value={this.state.sendingMess}
                                        onChange={value => this.updateSendMess(value)}
                                        disabled={this.state.isAllowed ? false : true}
                                        placeholder="message"
                                        enterButton="send"
                                        onSearch={value => this.sendMessage(value)}
                                    />
                                </div>
                            </Footer>
                        </Layout>

                        <Sider>

                            <div className="profile-pannel">
                                <span>
                                    <Avatar size={70} style={{ backgroundColor: 'black' }} icon="user" />
                                </span>
                                <h3 className='name-style'>{name}</h3>
                                <h5 className='white-txt'>{phone}</h5>
                                <h5 className='white-txt'>{email}</h5>
                            </div>

                            <Menu
                                theme='light'
                                className="command-menu">

                                <Menu.Item key="1"
                                    onClick={(event) => this.openNewConvModal()}>
                                    <span>
                                        <Icon type="message" style={{ padding: 8, fontSize: '25px', color: '#17212b' }} />
                                        <span style={{}}>New conversion</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="2"
                                    onClick={(event) => this.openAddContactModal()}>
                                    <span>
                                        <Icon type="user-add" style={{ padding: 8, fontSize: '25px', color: '#17212b' }} />
                                        <span>Add Contact</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="3"
                                    onClick={(event) => this.openNewGroupModal()}>
                                    <span>
                                        <Icon type="usergroup-add" style={{ padding: 8, fontSize: '25px', color: '#17212b' }} />
                                        <span>New group</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="4"
                                    onClick={(event) => this.openNewChannelModal()}>
                                    <span>
                                        <Icon type="sound" style={{ padding: 8, fontSize: '25px', color: '#17212b' }} />
                                        <span>New Chennel</span>
                                    </span>
                                </Menu.Item>

                                <Menu.Item key="5"
                                    onClick={(event) => this.handleLogout()}>
                                    <span>
                                        <Icon type="logout" style={{ padding: 8, fontSize: '25px', color: '#17212b' }} />
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

                        <Search
                            placeholder="user phone number" onSearch={value => this.searchingUser(value)} enterButton />
                        <center>
                            <Avatar
                                visibility={this.state.userFounded ? "visible" : "hidden"}
                                size={45} style={{ marginTop: 20, verticalAlign: 'middle', alignSelf: 'center' }}>
                                <h2>{this.state.searchedUser.name !== undefined ? this.state.searchedUser.name[0] : ""}</h2>
                            </Avatar>

                            <h4 style={{ paddingTop: 10 }}>{this.state.searchedUser.name !== undefined ? this.state.searchedUser.name : ''}</h4>

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
                            <Input
                                value={this.state.newChatName} onChange={this.updateChatName}
                                placeholder='Chat Name' />

                            <center><h4>{'Select contact'}</h4></center>

                            <Select
                                mode="multiple"
                                style={{ width: '60%', marginTop: 20 }}
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

                                <Button style={{ marginTop: 20 }}
                                    type={this.state.isUserBlocked === true ? "primary" : "danger"} block
                                    onClick={this.blockOrUnblockUser}>
                                    {this.state.isUserBlocked === true ? "Unblock User" : "Block User"}
                                </Button>
                            </center>

                        </div>

                    </Modal>

                    <Modal
                        title="New Conversion"
                        visible={this.state.newConvModalVisib}
                        onOk={this.handleNewConvOk}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleNewConvCancel}
                    >
                        <div>

                            <center>
                                <h4>{'Select contact'}</h4>
                                <Select
                                    mode="single"
                                    style={{ width: '60%', margin: 20 }}
                                    placeholder="select Contact"
                                    onChange={this.handleSelectContactChange}
                                >
                                    {this.state.contactNames}
                                </Select>
                            </center>

                        </div>

                    </Modal>

                    <Modal
                        title="Chat info"
                        visible={this.state.publicChatModalVisib}
                        onOk={this.handlePublicChatInfoOk}
                        onCancel={this.handlePublicChatInfoCancel}
                    >
                        <div>
                            <center>
                                <h2>{this.state.curChatInfo != null ? this.state.curChatInfo.name : ''}</h2>
                                <h4>Members</h4>

                                <TreeSelect
                                    disabled={!this.state.isAdmin}
                                    {...this.state.treeProps} />

                                <Button
                                    disabled={!this.state.isAdmin}
                                    style={{ width: '60%', marginTop: 20 }} type="primary" block
                                    onClick={this.updateChatMembers}>
                                    Update Members
                            </Button>

                                <Button
                                    disabled={!this.state.isAdmin}
                                    style={{ width: '60%', marginTop: 20 }} type="danger" block
                                    onClick={this.deleteChat}>
                                    Delete Chat
                            </Button>
                            </center>

                        </div>

                    </Modal>
                </Layout>


            </div>
        )
    }
}
