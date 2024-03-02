import { useEffect, useState } from 'react';
import { Route, RouterProvider, Routes, useLocation } from 'react-router-dom';

import { router } from './routes/routes';
import { useAppDispatch } from './redux/hook';
import { setUser, setUserLoading } from './redux/features/user/userSlice';
import { StoreToCookies } from './utils/cookies';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUserLoading(true));
    dispatch(setUser(StoreToCookies.getUserFromCookie()));
    dispatch(setUserLoading(false));
  }, [dispatch]);
  return <RouterProvider router={router} />;
}

export default App;
