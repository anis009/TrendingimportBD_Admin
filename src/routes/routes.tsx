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
              <PageTitle title="TrendingImportBD | Users List" />
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
              <PageTitle title="TrendingImportBD | Users List" />
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
              <PageTitle title="TrendingImportBD | Clients" />
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
              <PageTitle title="TrendingImportBD | Clients" />
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
              <PageTitle title="TrendingImportBD | Clients Details" />
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
              <PageTitle title="TrendingImportBD | Account profile" />
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
              <PageTitle title="TrendingImportBD | Categories Management" />
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
              <PageTitle title="TrendingImportBD | SubCategories Management" />
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
              <PageTitle title="TrendingImportBD | Products Management" />
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
              <PageTitle title="TrendingImportBD | Create Product" />
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
              <PageTitle title="TrendingImportBD | Update Product" />
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
