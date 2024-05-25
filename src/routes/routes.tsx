import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PageTitle from '../components/PageTitle';
import NotFound from '../pages/NotFound';
import PrivateRoute from './privateRoutes';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ListRequestCallBack from '../pages/RequestCallBack/ListRequestCallBack';
import Quotations from '../pages/Quotations/Quotations';
import ListClients from '../pages/Clients/ListClients';
import ClientDetails from '../pages/Clients/ClientDetails';
import QuotationsDetails from '../pages/Quotations/QuotationsDetails';
import ListOrders from '../pages/Orders/ListOrders';
import ListMyRequestCallBack from '../pages/RequestCallBack/ListMyRequestCallBack';
import Profile from '../pages/Profile/Profile';
import ListUsers from '../pages/Users/ListUsers';
import AllClients from '../pages/Clients/AllCients';

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
              <PageTitle title="FcFl | Request Call Back" />
              <ListRequestCallBack />
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
        path: '/my-request-call-back',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Request Call Back" />
              <ListMyRequestCallBack />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/users/users-list',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Users List" />
              <ListUsers />
            </>
          </PrivateRoute>
        ),
      },

      {
        path: '/quotations',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Quotations" />
              <Quotations />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/my-clients',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Clients" />
              <ListClients />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/all-clients',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Clients" />
              <AllClients />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Clients" />
              <ListOrders />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/clients/:id',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Clients Details" />
              <ClientDetails />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/quotations/:id',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Clients Details" />
              <QuotationsDetails />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Account profile" />
              <Profile />
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
