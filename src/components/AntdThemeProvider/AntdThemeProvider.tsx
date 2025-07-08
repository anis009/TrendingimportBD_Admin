import React from 'react';
import { ConfigProvider } from 'antd';
import { lightTheme, darkTheme } from '../../config/antdTheme';
import useColorMode from '../../hooks/useColorMode';

interface AntdThemeProviderProps {
  children: React.ReactNode;
}

const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  const [colorMode] = useColorMode();

  const currentTheme = colorMode === 'dark' ? darkTheme : lightTheme;

  return <ConfigProvider theme={currentTheme}>{children}</ConfigProvider>;
};

export default AntdThemeProvider;
