import React, { useState, useEffect } from 'react';
import {
    ShoppingOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
    SettingOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import CurrentDateTime from "./CurrentDateTime.tsx";
import HeaderControls from "./HeaderControls";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

// Updated color theme constants based on your requirements
const colors = {
  primary: '#A67B5B',      
  primaryLight: '#DBC1AD',   
  background: '#F6F4F1',     
  text: '#333333',         
  cardBg: '#FFFFFF',         
  headerBg: '#F6F4F1',       
};

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initial check
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    // Main navigation items with updated styling
    const mainNavItems: MenuItem[] = [
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Overview</span>, '/home', <AppstoreOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/home')),
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Employees</span>, '/employees', <TeamOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/employees')),
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Customers</span>, '/customers', <UserOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/customers')),
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Products</span>, '/products', <ShoppingOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/products')),
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Suppliers</span>, '/suppliers', <ShopOutlined style={{ fontSize: '20px', color: 'white' }} />, undefined, () => navigate('/suppliers')),
    ];

    // Bottom navigation items (Settings)
    const bottomNavItems: MenuItem[] = [
        getItem(<span style={{ fontWeight: 'bold', color: 'white' }}>Settings</span>, '/settings', <SettingOutlined style={{ fontSize: '24px', color: 'white' }} />),
    ];

    // Combine both for navigation purposes
    const allNavItems = [...mainNavItems, ...bottomNavItems];

    // Sync selected keys with current route
    useEffect(() => {
        const currentPath = location.pathname;
        const selectedItem = allNavItems.find(item => item?.key === currentPath);
        if (selectedItem) {
            setSelectedKeys([selectedItem.key as string]);
        }
    }, [location.pathname]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);

    // Handle screen size changes for auto-collapsing
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)'); 

        const handleResize = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            if (e.matches) {
                setCollapsed(true); 
            } else {
                setCollapsed(false); 
            }
        };

       
        setIsMobile(mediaQuery.matches);
        if (mediaQuery.matches) {
            setCollapsed(true);
        }

       
        mediaQuery.addEventListener('change', handleResize);

        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    
    const handleCollapse = (value: boolean) => {
        setCollapsed(value);
    };

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
            case '/profile':
                return 'Profile';
            default:
                return 'Overview';
        }
    };

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden', background: colors.background }}>
            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={handleCollapse} 
                style={{ 
                    background: colors.primary, 
                    height: '100%', 
                    overflow: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
                }}
            >
                <div className="logo" style={{ 
                    height: '64px', 
                    background: colors.primary, 
                    margin: '16px 0 8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {!collapsed && (
                        <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '1px' }}>WRENIX</Title>
                    )}
                    {collapsed && (
                        <HomeOutlined style={{ fontSize: '24px', color: 'white' }} />
                    )}
                </div>
                
                <Menu
                    theme="dark"
                    mode="inline"
                    items={mainNavItems}
                    selectedKeys={selectedKeys}
                    onClick={({ key }) => {
                        navigate(key);
                        setSelectedKeys([key]);
                    }}
                    style={{ 
                        backgroundColor: colors.primary, 
                        flex: 1,
                        marginTop: '0',
                        padding: '0',
                        borderRight: 'none'
                    }}
                />
                
                <div style={{ 
                    marginTop: 'auto', 
                    borderTop: '1px solid rgba(255,255,255,0.2)', 
                    paddingTop: '8px' 
                }}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={bottomNavItems}
                        selectedKeys={selectedKeys}
                        onClick={({ key }) => {
                            navigate(key);
                            setSelectedKeys([key]);
                        }}
                        style={{ backgroundColor: colors.primary, borderRight: 'none' }}
                    />
                </div>
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 20px',
                    background: colors.headerBg,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'fixed',
                    top: 0,
                    left: collapsed ? 80 : 200,
                    right: 0,
                    zIndex: 100,
                    transition: 'left 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Title level={4} style={{ margin: 0, color: 'black' }}>
                        {getBreadcrumb()}
                    </Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <CurrentDateTime />
                        <HeaderControls userName="Admin User" />
                    </div>
                </Header>
                <Content style={{
                    margin: '0 16px',
                    marginTop: 80,
                    overflow: 'auto',
                    height: 'calc(100vh - 80px - 69px)',
                    background: colors.background
                }}>
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
                            background: colors.cardBg,
                            borderRadius: borderRadiusLG,
                            height: 'calc(100vh - 80px - 69px - 48px)',
                            overflow: 'auto',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ 
                    textAlign: 'center',
                    padding: '12px 20px',
                    position: 'sticky',
                    bottom: 0,
                    background: '#A67B5B',
                    boxShadow: '0px -2px 10px rgba(0,0,0,0.05)',
                    color: '#fff'
                }}>
                    Wrenix ©{new Date().getFullYear()} All Rights Reserved
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DashboardNavigation;