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
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://first-class-for-less-admin-back-end.vercel.app/api/v1',
  }),
  endpoints: () => ({}),
});
