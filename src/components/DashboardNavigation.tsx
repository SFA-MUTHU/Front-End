import React, { useState, useEffect } from 'react';
import {
    ShoppingOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
    SettingOutlined,
    HomeOutlined,
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import CurrentDateTime from "./CurrentDateTime.tsx";
import HeaderControls from "./HeaderControls";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const colors = {
    primary: '#A67B5B',
    primaryLight: '#DBC1AD',
    background: '#F6F4F1',
    text: '#333333',
    cardBg: '#FFFFFF',
    headerBg: '#F6F4F1',
};
const styleElement = document.createElement('style');

const css = `
  .ant-menu-dark .ant-menu-item-selected {
    background-color: #DBC1AD !important;
  }

  .ant-menu-dark .ant-menu-item-selected a {
    color: #000 !important; /* Or white if you prefer */
  }

  .ant-menu-dark .ant-menu-item-selected .anticon {
    color: #000 !important;
  }
`;

styleElement.textContent = css;

document.head.appendChild(styleElement);

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
    // @ts-ignore
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const mainNavItems: MenuItem[] = [
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Overview</span>, '/home', <AppstoreOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/home')),
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Employees</span>, '/employees', <TeamOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/employees')),
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Customers</span>, '/customers', <UserOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/customers')),
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Products</span>, '/products', <ShoppingOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/products')),
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Suppliers</span>, '/suppliers', <ShopOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/suppliers')),
    ];

    const bottomNavItems: MenuItem[] = [
        getItem(<span style={{ fontWeight: 'bold', fontFamily: 'Roboto', color: 'white' }}>Settings</span>, '/settings', <SettingOutlined style={{ fontSize: '24px', color: 'white' }} />),
    ];

    const allNavItems = [...mainNavItems, ...bottomNavItems];

    useEffect(() => {
        const currentPath = location.pathname;
        const selectedItem = allNavItems.find(item => item?.key === currentPath);
        if (selectedItem) {
            setSelectedKeys([selectedItem.key as string]);
        }
    }, [location.pathname]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        const handleResize = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            setCollapsed(e.matches);
        };

        setIsMobile(mediaQuery.matches);
        setCollapsed(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const getBreadcrumb = () => {
        switch (location.pathname) {
            case '/home': return 'Overview';
            case '/employees': return 'Employees';
            case '/customers': return 'Customers';
            case '/products': return 'Products';
            case '/suppliers': return 'Suppliers';
            case '/profile': return 'Profile';
            case '/settings': return 'Settings';
            default: return 'Overview';
        }
    };

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden', background: colors.background, fontFamily: 'Roboto, sans-serif' }}>

            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={setCollapsed} 
                trigger={
                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        backgroundColor: colors.primary,
                        color: 'white'
                    }}>
                        {collapsed ? <RightOutlined /> : <LeftOutlined />}
                    </div>
                }
                style={{ background: colors.primary, height: '100%', boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}
            >

                <div className="logo" style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {!collapsed ? (
                        <Title level={4} style={{ margin: 0, fontFamily: 'Roboto', color: 'white' }}>Muthu Tex</Title>
                    ) : (
                        <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
                    )}
                </div>
                <Menu theme="dark" mode="inline" items={mainNavItems} selectedKeys={selectedKeys} onClick={({ key }) => { navigate(key); setSelectedKeys([key]); }} style={{ backgroundColor: colors.primary, fontFamily: 'Roboto' }} />
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
                    <Menu theme="dark" mode="inline" items={bottomNavItems} selectedKeys={selectedKeys} onClick={({ key }) => { navigate(key); setSelectedKeys([key]); }} style={{ backgroundColor: colors.primary, fontFamily: 'Roboto' }} />
                </div>
            </Sider>
            <Layout>
                <Header style={{ padding: '0 20px', background: colors.headerBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'Roboto' }}>
                    <Title level={4} style={{ margin: 0 }}>{getBreadcrumb()}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <CurrentDateTime />
                        <HeaderControls userName="Admin User" />
                    </div>
                </Header>
                <Content style={{ margin: '16px', overflow: 'auto', background: colors.background, fontFamily: 'Roboto' }}>
                    <Breadcrumb style={{ margin: '16px 0', fontFamily: 'Roboto' }} items={[{ title: 'Overview' }, { title: getBreadcrumb() }]} />
                    <div style={{ padding: 24, background: colors.cardBg, borderRadius: borderRadiusLG }}>
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', background: colors.primary, color: 'white', fontFamily: 'Roboto' }}>
                    Wrenix ©{new Date().getFullYear()} All Rights Reserved
                </Footer>
            </Layout>
        </Layout>
       
    );
};

export default DashboardNavigation;

