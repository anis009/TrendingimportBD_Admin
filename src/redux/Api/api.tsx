import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const api = createApi({
  reducerPath: 'api',
  tagTypes: [
    'user',
    'users',
    'requestcallbacks',
    'requestcallback',
    'quotations',
    'quotation',
    'clients',
    'client',
    'orders'
  ],
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://first-class-for-less-admin-back-end.vercel.app/api/v1',
    baseUrl: 'http://localhost:5000/api/v1',
  }),
  endpoints: () => ({}),
});
