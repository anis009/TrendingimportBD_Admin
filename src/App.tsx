import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/routes';
import { useAppDispatch } from './redux/hook';
import { setUser, setUserLoading } from './redux/features/user/userSlice';
import { StoreToCookies } from './utils/cookies';
import AntdThemeProvider from './components/AntdThemeProvider/AntdThemeProvider';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUserLoading(true));
    dispatch(setUser(StoreToCookies.getUserFromCookie()));
    dispatch(setUserLoading(false));
  }, [dispatch]);
  return (
    <AntdThemeProvider>
      <RouterProvider router={router} />
    </AntdThemeProvider>
  );
}

export default App;
