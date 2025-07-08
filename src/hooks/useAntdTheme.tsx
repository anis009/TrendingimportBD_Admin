import { theme } from 'antd';
import { lightTheme, darkTheme } from '../config/antdTheme';
import useColorMode from './useColorMode';

export const useAntdTheme = () => {
  const [colorMode] = useColorMode();
  const { token } = theme.useToken();

  const currentTheme = colorMode === 'dark' ? darkTheme : lightTheme;
  const isDark = colorMode === 'dark';

  return {
    colorMode,
    isDark,
    currentTheme,
    token,
  };
};

export default useAntdTheme;
