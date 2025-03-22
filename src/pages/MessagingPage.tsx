import React, { useState } from 'react';
import { Form, Select, Input, Button, Row, Col, Card, message as antdMessage } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, UnorderedListOutlined, OrderedListOutlined } from '@ant-design/icons';
import '../styles/messagingPage.scss'; // Make sure this points to the correct file

const { Option } = Select;
const { TextArea } = Input;

const MessagingPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Inbox messages state with initial dummy messages
  const [inboxMessages, setInboxMessages] = useState([
    {
      title: 'Huge Sale Alert!',
      time: '2 days ago',
      membership: '@Platinum Members',
      text: 'Get 50% OFF on ALL items at CStore!! 🎉 Hurry, limited time!',
    },
    {
      title: 'Black Friday Mega Sale!',
      time: '3 days ago',
      membership: '@All Members',
      text: 'Enjoy up to 70% discount on selected products! 😍 Don’t miss out!',
    },
    {
      title: 'New Arrivals!',
      time: '5 days ago',
      membership: '@Basic Members',
      text: 'Check out our new collection of summer wear. ☀️ Trendy & fresh!',
    },
  ]);

  const resetForm = () => {
    setSelectedPackage(undefined);
    setTitle('');
    setContent('');
  };

  const sendMessage = () => {
    if (!selectedPackage || !title || !content) {
      antdMessage.error('Please fill all fields before sending.');
      return;
    }
    antdMessage.success('Message sent successfully!');
    const newMessage = {
      title,
      time: 'Just now',
      membership: selectedPackage
        ? `@${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Members`
        : '@Members',
      text: content,
    };
    setInboxMessages((prev) => [newMessage, ...prev]);
    resetForm();
  };

  return (
    <div className="messaging-container">
      <Row gutter={[24, 24]}>
        {/* Left Column: Message Composer */}
        <Col xs={24} md={12}>
          <Card 
            title="Compose Message" 
            className="messaging-card"
            headStyle={{ color: '#1890ff', fontSize: 20, fontWeight: 600, borderBottom: '1px solid #eaeaea' }}
          >
            <Form layout="vertical">
              <Form.Item label={<span className="form-label">Package</span>}>
                <Select 
                  placeholder="Select the package"
                  value={selectedPackage}
                  onChange={(value) => setSelectedPackage(value)}
                  className="package-select"
                >
                  <Option value="all">All</Option>
                  <Option value="basic">Basic Members</Option>
                  <Option value="platinum">Platinum Members</Option>
                  <Option value="premium">Premium Members</Option>
                </Select>
              </Form.Item>
              <Form.Item label={<span className="form-label">Formatting</span>}>
                <div className="formatting-buttons">
                  <Button icon={<BoldOutlined />} className="format-button" />
                  <Button icon={<ItalicOutlined />} className="format-button" />
                  <Button icon={<UnderlineOutlined />} className="format-button" />
                  <Button icon={<UnorderedListOutlined />} className="format-button" />
                  <Button icon={<OrderedListOutlined />} className="format-button" />
                </div>
              </Form.Item>
              <Form.Item label={<span className="form-label">Title</span>}>
                <Input 
                  placeholder="Type the Title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="title-input"
                />
              </Form.Item>
              <Form.Item label={<span className="form-label">Message</span>}>
                <TextArea 
                  rows={6} 
                  placeholder="Type your message" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="message-input"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={sendMessage} 
                  className="send-button"
                >
                  Send Message
                </Button>
                <Button 
                  onClick={resetForm} 
                  className="reset-button"
                >
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Inbox with scrollable messages */}
        <Col xs={24} md={12}>
          <Card 
            title="Inbox" 
            className="inbox-card"
            headStyle={{ fontSize: 20, fontWeight: 600, color: '#1890ff', borderBottom: '1px solid #eaeaea' }}
          >
            <div className="message-list">
              {inboxMessages.map((msg, index) => (
                <Card 
                  key={index} 
                  type="inner" 
                  className="message-item"
                >
                  <div className="message-header">
                    <span className="message-title">{msg.title}</span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <div className="message-membership">{msg.membership}</div>
                  <div className="message-text">
                    {msg.text}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MessagingPage;
