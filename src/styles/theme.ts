/**
 * Application-wide theme configuration
 */

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#9C7456',
    primaryLight: '#DBC1AD',
    primaryDark: '#7A5A42',
    
    // Secondary colors
    secondary: '#4A6FA5',
    secondaryLight: '#6B8EB8',
    secondaryDark: '#385780',
    
    // Accent colors
    accent: '#47B881',
    accentLight: '#6ED09E',
    accentDark: '#349464',
    
    // Semantic colors
    success: '#2ECC71',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',
    
    // Neutrals
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    background: '#F8F9FA',
    cardBg: '#FFFFFF',
    border: '#E1E4E8',
  },
  
  // Shadows
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.05)',
    medium: '0 4px 12px rgba(0,0,0,0.1)',
    large: '0 8px 24px rgba(0,0,0,0.15)',
  },
  
  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export default theme;
