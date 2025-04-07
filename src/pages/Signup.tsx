import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Checkbox, Typography, Steps, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BagroundImag from "../assets/img/background .webp";
import LogCharacter from "../assets/img/log.webp";
import '../style/signup.css';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [form] = Form.useForm();

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextStep = async () => {
        try {
            if (currentStep === 0) {
                await form.validateFields(['firstName', 'lastName', 'mobile']);
            } else if (currentStep === 1) {
                await form.validateFields(['email', 'role']);
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success('Account created successfully!', {
                position: "top-left",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => navigate('/login')
            });
        }, 1500);
    };

    const steps = [
        {
            title: 'Personal',
            content: (
                <>
                    <Form.Item
                        name="firstName"
                        rules={[{ required: true, message: 'Please enter your first name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="First Name" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        rules={[{ required: true, message: 'Please enter your last name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Last Name" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="mobile"
                        rules={[{ required: true, message: 'Please enter your mobile number!' }]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" size="large" />
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Account',
            content: (
                <>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        rules={[{ required: true, message: 'Please select your role!' }]}
                    >
                        <Select placeholder="Select Role" size="large">
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                            <Option value="manager">Manager</Option>
                        </Select>
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Security',
            content: (
                <>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 8, message: 'Password must be at least 8 characters!' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
                            },
                        ]}
                    >
                        <Checkbox>
                            I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </Checkbox>
                    </Form.Item>
                </>
            )
        }
    ];

    // @ts-ignore
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
                        <Title level={2} style={{ color: '#9C7456', margin: 0 }}>Create Account</Title>
                        <Text type="secondary">Create New Employee For Muthu Textile</Text>
                    </div>

                    <Steps current={currentStep} style={{ marginBottom: '24px' }}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>

                    <Form
                        form={form}
                        name="signup_form"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        {steps[currentStep].content}

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                            {currentStep > 0 && (
                                <Button onClick={prevStep}>
                                    Back
                                </Button>
                            )}

                            {currentStep < steps.length - 1 && (
                                <Button type="primary" onClick={nextStep} style={{ marginLeft: 'auto', backgroundColor: '#9C7456', borderColor: '#9C7456' }}>
                                    Next
                                </Button>
                            )}

                            {currentStep === steps.length - 1 && (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    style={{ marginLeft: 'auto', backgroundColor: '#9C7456', borderColor: '#9C7456' }}
                                >
                                    Create Account
                                </Button>
                            )}
                        </div>
                    </Form>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        Already have an account? <Link to="/login" style={{color: '#9C7456'}}>Login</Link>
                    </div>
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

export default Signup;
