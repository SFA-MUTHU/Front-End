import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Input, Button, List, Avatar, 
  Badge, Tabs, Dropdown, Menu, Divider, Empty, Spin
} from 'antd';
import { 
  SendOutlined, SmileOutlined, PaperClipOutlined, 
  UserOutlined, TeamOutlined, BellOutlined, MoreOutlined,
  SearchOutlined, PhoneOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import DashboardNavigation from '../components/DashboardNavigation';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'away' | 'offline';
}

const Messaging: React.FC = () => {
  const location = useLocation();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get selected customers from navigation state
  const selectedCustomers = location.state?.selectedCustomers || [];

  useEffect(() => {
    // Simulate loading contacts and messages
    setTimeout(() => {
      const dummyContacts: Contact[] = [
        {
          id: '1',
          name: 'James Wilson',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          lastMessage: 'I need some information about my recent order',
          time: '10:30 AM',
          unread: 3,
          status: 'online'
        },
        {
          id: '2',
          name: 'Ava Harris',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          lastMessage: 'Thanks for your help!',
          time: 'Yesterday',
          unread: 0,
          status: 'away'
        },
        {
          id: '3',
          name: 'Liam Smith',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          lastMessage: 'When will my order ship?',
          time: 'Yesterday',
          unread: 1,
          status: 'offline'
        },
        {
          id: '4',
          name: 'Emma Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          lastMessage: 'I would like to return an item',
          time: '2 days ago',
          unread: 0,
          status: 'online'
        },
        {
          id: '5',
          name: 'Noah Brown',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          lastMessage: 'Do you have this in a different color?',
          time: '3 days ago',
          unread: 0,
          status: 'offline'
        }
      ];
      
      setContacts(dummyContacts);
      
      if (dummyContacts.length > 0) {
        setSelectedContact(dummyContacts[0]);
        // Load messages for the first contact
        setMessages([
          {
            id: 1,
            sender: dummyContacts[0].name,
            content: "Hello, I need some information about my recent order.",
            timestamp: "10:30 AM",
            isOwn: false
          },
          {
            id: 2,
            sender: "Me",
            content: "Hi there! I'd be happy to help. Could you provide your order number?",
            timestamp: "10:32 AM",
            isOwn: true
          },
          {
            id: 3,
            sender: dummyContacts[0].name,
            content: "Sure, it's #ORD-28759.",
            timestamp: "10:33 AM",
            isOwn: false
          },
          {
            id: 4,
            sender: "Me",
            content: "Thanks! Let me check that for you. One moment please.",
            timestamp: "10:34 AM",
            isOwn: true
          }
        ]);
      }
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Me",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Simulate fetching messages for this contact
    setLoading(true);
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: contact.name,
          content: contact.lastMessage,
          timestamp: contact.time,
          isOwn: false
        },
        {
          id: 2,
          sender: "Me",
          content: "Hi there! How can I help you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#52c41a';
      case 'away': return '#faad14';
      default: return '#bfbfbf';
    }
  };

  return (
    <DashboardNavigation>
      <div style={{ padding: '20px' }}>
        <Title level={3} style={{ marginBottom: '20px' }}>Messaging</Title>
        
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: 'calc(100vh - 200px)' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Contacts sidebar */}
            <div style={{ 
              width: '300px', 
              borderRight: '1px solid #f0f0f0',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '0 10px 10px' }}>
                <Input 
                  placeholder="Search contacts..." 
                  prefix={<SearchOutlined />} 
                  style={{ marginBottom: '10px' }}
                />
                
                <Tabs defaultActiveKey="1" size="small">
                  <TabPane tab="All" key="1" />
                  <TabPane tab="Unread" key="2" />
                  <TabPane tab="Customers" key="3" />
                </Tabs>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : (
                  <List
                    dataSource={contacts}
                    renderItem={(contact) => (
                      <List.Item 
                        onClick={() => handleContactSelect(contact)}
                        style={{ 
                          cursor: 'pointer', 
                          padding: '12px 16px',
                          backgroundColor: selectedContact?.id === contact.id ? '#f5f5f5' : 'transparent'
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge dot status={contact.status as any} offset={[-5, 35]}>
                              <Avatar src={contact.avatar} size="large" />
                            </Badge>
                          }
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong>{contact.name}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>{contact.time}</Text>
                            </div>
                          }
                          description={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text 
                                type="secondary" 
                                ellipsis 
                                style={{ maxWidth: '160px' }}
                              >
                                {contact.lastMessage}
                              </Text>
                              {contact.unread > 0 && (
                                <Badge count={contact.unread} style={{ backgroundColor: '#9C7456' }} />
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
            
            {/* Chat area */}
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}>
              {selectedContact ? (
                <>
                  {/* Chat header */}
                  <div style={{ 
                    padding: '10px 16px', 
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Badge status={selectedContact.status as any} offset={[-5, 35]}>
                        <Avatar src={selectedContact.avatar} />
                      </Badge>
                      <div style={{ marginLeft: '12px' }}>
                        <Text strong>{selectedContact.name}</Text>
                        <div>
                          <Badge 
                            color={getStatusColor(selectedContact.status)} 
                            text={selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)} 
                            style={{ fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Button type="text" icon={<PhoneOutlined />} />
                      <Button type="text" icon={<VideoCameraOutlined />} />
                      <Dropdown overlay={
                        <Menu>
                          <Menu.Item key="1">View Profile</Menu.Item>
                          <Menu.Item key="2">Mute Conversation</Menu.Item>
                          <Menu.Item key="3" danger>Block Contact</Menu.Item>
                        </Menu>
                      }>
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div style={{ 
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    backgroundColor: '#f9f9f9'
                  }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                      </div>
                    ) : (
                      messages.map(message => (
                        <div 
                          key={message.id}
                          style={{
                            display: 'flex',
                            justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                            marginBottom: '16px'
                          }}
                        >
                          {!message.isOwn && (
                            <Avatar 
                              src={selectedContact.avatar} 
                              style={{ marginRight: '8px', alignSelf: 'flex-end' }}
                            />
                          )}
                          
                          <div>
                            <div
                              style={{
                                backgroundColor: message.isOwn ? '#9C7456' : '#fff',
                                color: message.isOwn ? '#fff' : '#333',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                maxWidth: '400px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                              }}
                            >
                              {message.content}
                            </div>
                            
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#999', 
                              marginTop: '4px',
                              textAlign: message.isOwn ? 'right' : 'left'
                            }}>
                              {message.timestamp}
                            </div>
                          </div>
                          
                          {message.isOwn && (
                            <Avatar 
                              icon={<UserOutlined />}
                              style={{ marginLeft: '8px', alignSelf: 'flex-end' }}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex' }}>
                      <TextArea
                        placeholder="Type a message..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        style={{ borderRadius: '20px', resize: 'none', flex: 1 }}
                      />
                      <Button 
                        type="primary" 
                        shape="circle" 
                        icon={<SendOutlined />} 
                        onClick={handleSendMessage} 
                        style={{ marginLeft: '8px', backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                      />
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Button type="text" icon={<SmileOutlined />} />
                      <Button type="text" icon={<PaperClipOutlined />} />
                    </div>
                  </div>
                </>
              ) : (
                <Empty 
                  description="Select a conversation to start messaging" 
                  style={{ margin: 'auto' }}
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardNavigation>
  );
};

export default Messaging;
