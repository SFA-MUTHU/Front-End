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
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Overview</span>, '/home', <AppstoreOutlined style={{ fontSize: '24px', color: 'white' }} />, undefined, () => navigate('/home')),
        getItem(<span style={{ fontWeight: 'bold',color: 'white' }}>Employees</span>, '/employees', <TeamOutlined style={{ fontSize: '24px', color: 'white' }} />, undefined, () => navigate('/employees')),
        getItem(<span style={{fontWeight: 'bold', color: 'white' }}>Customers</span>, '/customers', <UserOutlined style={{ fontSize: '24px', color: 'white' }} />, undefined, () => navigate('/customers')),
        getItem(<span style={{fontWeight: 'bold', color: 'white' }}>Products</span>, '/products', <ShoppingOutlined style={{ fontSize: '24px', color: 'white' }} />, undefined, () => navigate('/products')),
        getItem(<span style={{fontWeight: 'bold', color: 'white' }}>Suppliers</span>, '/suppliers', <ShopOutlined style={{ fontSize: '24px', color: 'white' }} />, undefined, () => navigate('/suppliers')),
        getItem(<span style={{fontWeight: 'bold', color: 'white' }}>GENERAL</span>, '6', <SettingOutlined style={{ fontSize: '24px', color: 'white' }} />),
        getItem(<span style={{fontWeight: 'bold', color: 'white' }}>Settings</span>, '7', <UserOutlined style={{ fontSize: '24px', color: 'white' }} />),
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
        <Layout style={{ minHeight: '100vh'  }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: '#9C7456' }}>
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
                    style={{ display: 'flex', backgroundColor:'#9C7456', flexDirection: 'column', justifyContent: 'space-between' }}
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
                            minHeight: 800,
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
