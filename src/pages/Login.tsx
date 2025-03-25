import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BagroundImag from "../assets/img/background .webp";
import LogCharacter from "../assets/img/log.webp";

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const onFinish = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Login successful!', {
                position: "top-left",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/home');
        }, 1500);
    };


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: `url(${BagroundImag})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px'
        }}>
            <ToastContainer />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '800px',
                flexDirection: screenWidth <= 768 ? 'column' : 'row'
            }}>

                <Card
                    style={{
                        width: screenWidth <= 768 ? '100%' : '50%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }}
                    bodyStyle={{ padding: '30px' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={2} style={{ color: '#9C7456', margin: 0 }}>Welcome Back</Title>
                        <Text type="secondary">Please sign in to continue</Text>
                    </div>

                    <Form
                        name="login_form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                style={{ backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                            >
                                Login
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Checkbox style={{ color: '#9C7456' }}>Remember me</Checkbox>
                            <Link to="/signup" style={{ float: 'right', color: '#9C7456' }}>Create New User</Link>
                        </Form.Item>
                    </Form>
                    <Divider>Muthu Textile ©</Divider>
                </Card>
                {screenWidth > 768 && (
                    <img
                        src={LogCharacter}
                        alt="Log Character"
                        style={{ width: '50%', height: 'auto' }}
                    />
                )}
            </div>
        </div>
    );
};

export default Login;