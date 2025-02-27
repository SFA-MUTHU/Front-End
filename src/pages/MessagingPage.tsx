import React, { useState } from 'react';
import { Form, Select, Input, Button, Row, Col, Card, message as antdMessage } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, UnorderedListOutlined, OrderedListOutlined } from '@ant-design/icons';

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
    <div style={{ 
      background: 'linear-gradient(135deg, #f9fafc, #e9eff5)', 
      minHeight: '100vh', 
      padding: 40, 
      fontFamily: 'sans-serif' 
    }}>
      <Row gutter={[24, 24]}>
        {/* Left Column: Message Composer */}
        <Col xs={24} md={12}>
          <Card 
            title="Compose Message" 
            style={{ borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            headStyle={{ color: '#1890ff', fontSize: 20, fontWeight: 600, borderBottom: '1px solid #eaeaea' }}
          >
            <Form layout="vertical">
              <Form.Item label={<span style={{ fontWeight: 500 }}>Package</span>}>
                <Select 
                  placeholder="Select the package"
                  value={selectedPackage}
                  onChange={(value) => setSelectedPackage(value)}
                  style={{ borderRadius: 4 }}
                >
                  <Option value="all">All</Option>
                  <Option value="basic">Basic Members</Option>
                  <Option value="platinum">Platinum Members</Option>
                  <Option value="premium">Premium Members</Option>
                </Select>
              </Form.Item>
              <Form.Item label={<span style={{ fontWeight: 500 }}>Formatting</span>}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button icon={<BoldOutlined />} style={{ borderRadius: 4 }} />
                  <Button icon={<ItalicOutlined />} style={{ borderRadius: 4 }} />
                  <Button icon={<UnderlineOutlined />} style={{ borderRadius: 4 }} />
                  <Button icon={<UnorderedListOutlined />} style={{ borderRadius: 4 }} />
                  <Button icon={<OrderedListOutlined />} style={{ borderRadius: 4 }} />
                </div>
              </Form.Item>
              <Form.Item label={<span style={{ fontWeight: 500 }}>Title</span>}>
                <Input 
                  placeholder="Type the Title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: 4, padding: '8px 12px' }}
                />
              </Form.Item>
              <Form.Item label={<span style={{ fontWeight: 500 }}>Message</span>}>
                <TextArea 
                  rows={6} 
                  placeholder="Type your message" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ borderRadius: 4, padding: '8px 12px' }}
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={sendMessage} 
                  style={{ marginRight: 12, borderRadius: 4, padding: '8px 20px' }}
                >
                  Send Message
                </Button>
                <Button 
                  onClick={resetForm} 
                  style={{ borderRadius: 4, padding: '8px 20px' }}
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
            style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            headStyle={{ fontSize: 20, fontWeight: 600, color: '#1890ff', borderBottom: '1px solid #eaeaea' }}
          >
            <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 12 }}>
              {inboxMessages.map((msg, index) => (
                <Card 
                  key={index} 
                  type="inner" 
                  style={{ 
                    marginBottom: 16, 
                    borderRadius: 8, 
                    border: '2px solid #e0e0e0', 
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)', 
                    transition: 'transform 0.2s' 
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>{msg.title}</span>
                    <span style={{ color: 'gray', fontSize: 12 }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 8, color: '#555' }}>{msg.membership}</div>
                  <div style={{ fontSize: 14, color: '#333', whiteSpace: 'pre-wrap' }}>
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
