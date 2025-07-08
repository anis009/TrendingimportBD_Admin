import { theme } from 'antd';

// Define your custom colors based on your Tailwind config
export const customColors = {
  primary: '#3C50E0',
  secondary: '#80CAEE',
  success: '#10B981',
  warning: '#FFBA00',
  error: '#DC3545',
  info: '#259AE6',
};

// Light theme configuration
export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: customColors.primary,
    colorSuccess: customColors.success,
    colorWarning: customColors.warning,
    colorError: customColors.error,
    colorInfo: customColors.info,
    colorBgBase: '#FFFFFF',
    colorTextBase: '#1C2434',
    colorBgContainer: '#FFFFFF',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
      headerBg: '#F7F9FC',
    },
  },
};

// Dark theme configuration
export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: customColors.primary,
    colorSuccess: customColors.success,
    colorWarning: customColors.warning,
    colorError: customColors.error,
    colorInfo: customColors.info,
    colorBgBase: '#1A222C',
    colorTextBase: '#AEB7C0',
    colorBgContainer: '#24303F',
    colorBgElevated: '#24303F',
    colorBorder: '#2E3A47',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
      colorBgContainer: '#1d2a39',
      borderColor: '#3d4d60',
    },
    Card: {
      borderRadius: 8,
      colorBgContainer: '#24303F',
    },
    Modal: {
      borderRadius: 8,
      contentBg: '#24303F',
      headerBg: '#24303F',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#24303F',
      colorBgContainer: '#24303F',
    },
    Form: {
      labelColor: '#AEB7C0',
    },
  },
};
