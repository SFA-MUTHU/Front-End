import React, { useState } from 'react';
import {
    ShoppingOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Overview ', '1', <AppstoreOutlined style={{ fontSize: '24px' }} />),
    getItem('Employees', '2', <TeamOutlined style={{ fontSize: '24px' }} />),
    getItem('Customers ', '3', <UserOutlined style={{ fontSize: '24px' }} />),
    getItem('Products ', '4', <ShoppingOutlined style={{ fontSize: '24px' }} />),
    getItem('Suppliers ', '5', <ShopOutlined style={{ fontSize: '24px' }} />),
];

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: 'red' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#B8B8B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Overview</Breadcrumb.Item>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 500,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        Bill is a cat.
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        background: '#9C7456', 
                        color: '#FFFFFF', 
                    }}
                >
                    Wrenix ©{new Date().getFullYear()} All Rights Reserved by Wrenix
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;