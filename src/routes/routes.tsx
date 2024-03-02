import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PageTitle from '../components/PageTitle';
import ECommerce from '../pages/Dashboard/ECommerce';
import NotFound from '../pages/NotFound';
import PrivateRoute from './privateRoutes';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ListRequestCallBack from '../pages/RequestCallBack/ListRequestCallBack';
import Test from '../pages/Test/Test';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl Dashboard" />
              <ECommerce />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/request-call-back',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Request Call Back" />
              <ListRequestCallBack />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/test',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Test" />
              <Test />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/auth/sign-in',
        element: <SignIn />,
      },
      {
        path: '/auth/sign-up',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
