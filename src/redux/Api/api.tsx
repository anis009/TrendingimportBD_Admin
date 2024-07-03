import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import 'vite/client'
const ENV = import.meta.env.VITE_ENV;
const API_PROD_URL = import.meta.env.VITE_API_PROD_URL;
const API_DEV_URL = import.meta.env.VITE_API_DEV_URL;
const API_STAGING_URL = import.meta.env.VITE_API_STAGING_URL;

export const api = createApi({
  reducerPath: 'api',
  tagTypes: [
    'addUser',
    'users',
    'requestcallbacks',
    'requestcallback',
    'quotations',
    'quotation',
    'clients',
    'client',
    'orders',
    'requestcallbacksToQuotations',
  ],
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://localhost:5000/api/v1',
    baseUrl:
      ENV === 'PROD'
        ? API_PROD_URL
        : ENV === 'STAGING'
        ? API_STAGING_URL
        : API_DEV_URL,
    prepareHeaders: (headers, { getState }: any) => {
      // Get the token from your auth state
      const token = getState()?.user?.user?.token;
      // console.log('api~~', getState().user, token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
