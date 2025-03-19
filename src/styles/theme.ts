/**  * Application-wide theme configuration  */
export const theme = {
  colors: {
    // Primary brand colors
    primary: '#A67B5B',        // Primary color (brown/tan)
    primaryLight: '#DBC1AD',   // Secondary color (lighter brown/tan)
    primaryDark: '#7A5A42',    // Kept from original as a dark variant

    // Secondary colors (unchanged from original)
    secondary: '#4A6FA5',
    secondaryLight: '#6B8EB8',
    secondaryDark: '#385780',

    // Accent colors (unchanged from original)
    accent: '#47B881',
    accentLight: '#6ED09E',
    accentDark: '#349464',

    // Semantic colors (unchanged from original)
    success: '#2ECC71',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',

    // Neutrals
    text: '#333333',           // Text color (dark gray)
    textSecondary: '#666666',
    textLight: '#999999',
    background: '#F6F4F1',     // Background color (off-white)
    cardBg: '#FFFFFF',         // Card background (white)
    border: '#E1E4E8',
  },

  // Shadows (unchanged)
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.05)',
    medium: '0 4px 12px rgba(0,0,0,0.1)',
    large: '0 8px 24px rgba(0,0,0,0.15)',
  },

  // Typography (unchanged)
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

  // Border radius (unchanged)
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },

  // Spacing (unchanged)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Transitions (unchanged)
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },

  // Z-index (unchanged)
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Added header background (not in original structure, placed under colors for consistency)
  headerBg: '#F6F4F1',       // Header background (same as main background)
};

export default theme;