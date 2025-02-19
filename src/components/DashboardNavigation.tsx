import React, { useState, useEffect } from 'react';
import {
    ShoppingOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    onClick?: () => void,
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        onClick,
    } as MenuItem;
}

const DashboardNavigation: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items: MenuItem[] = [
        getItem('Overview', '/home', <AppstoreOutlined style={{ fontSize: '24px' }} />, undefined, () => navigate('/home')),
        getItem('Employees', '/employees', <TeamOutlined style={{ fontSize: '24px' }} />, undefined, () => navigate('/employees')),
        getItem('Customers', '/customers', <UserOutlined style={{ fontSize: '24px' }} />, undefined, () => navigate('/customers')),
        getItem('Products', '/products', <ShoppingOutlined style={{ fontSize: '24px' }} />, undefined, () => navigate('/products')),
        getItem('Suppliers', '/suppliers', <ShopOutlined style={{ fontSize: '24px' }} />, undefined, () => navigate('/suppliers')),
        getItem('GENERAL', '6', <SettingOutlined style={{ fontSize: '24px' }} />),
        getItem('Settings', '7', <UserOutlined style={{ fontSize: '24px' }} />),
    ];

    useEffect(() => {
        const currentPath = location.pathname;
        const selectedItem = items.find(item => item?.key === currentPath);
        if (selectedItem) {
            setSelectedKeys([selectedItem.key as string]);
        }
    }, [location.pathname]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);

    const getBreadcrumb = () => {
        switch (location.pathname) {
            case '/home':
                return 'Overview';
            case '/employees':
                return 'Employees';
            case '/customers':
                return 'Customers';
            case '/products':
                return 'Products';
            case '/suppliers':
                return 'Suppliers';
            default:
                return 'Overview';
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={items}
                    selectedKeys={selectedKeys}
                    onClick={({ key }) => {
                        navigate(key);
                        setSelectedKeys([key]);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#B8B8B8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb 
                        style={{ margin: '16px 0' }}
                        items={[
                          { title: 'Overview' },
                          { title: getBreadcrumb() },
                        ]}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 500,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Wrenix ©{new Date().getFullYear()} All Right Reserved by Wrenix
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DashboardNavigation;
