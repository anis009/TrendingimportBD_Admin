import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import PageTitle from '../components/PageTitle';
import NotFound from '../pages/NotFound';
import PrivateRoute from './privateRoutes';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ListClients from '../pages/Clients/ListClients';
import ClientDetails from '../pages/Clients/ClientDetails';
import Profile from '../pages/Profile/Profile';
import ListUsers from '../pages/Users/ListUsers';
import AllClients from '../pages/Clients/AllCients';
import Categories from '../pages/Categories/Categories';
import SubCategories from '../pages/SubCategories/SubCategories';
import Products from '../pages/Products/Products';
import CreateProduct from '../pages/Products/CreateProduct';
import UpdateProduct from '../pages/Products/UpdateProduct';

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
              <PageTitle title="FcFl | Users List" />
              <ListUsers />
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
        path: '/categories',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Categories Management" />
              <Categories />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/subcategories',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | SubCategories Management" />
              <SubCategories />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/products',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Products Management" />
              <Products />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/products/create',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Create Product" />
              <CreateProduct />
            </>
          </PrivateRoute>
        ),
      },
      {
        path: '/products/update/:id',
        element: (
          <PrivateRoute>
            <>
              <PageTitle title="FcFl | Update Product" />
              <UpdateProduct />
            </>
          </PrivateRoute>
        ),
      },

      {
        path: '/auth/sign-up',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
