import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: (id) => `/clients?userId=${id}`,
      providesTags: ['clients'],
    }),
    getQuotationsEmail: builder.query({
      query: () => `/clients/email`,
      providesTags: ['clients'],
    }),
    getSingleClients: builder.query({
      query: (id) => `/clients/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'client', id }],
    }),
    getSingle: builder.query({
      query: (id) => `/clients/single/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'client', id }],
    }),
    postClient: builder.mutation({
      query: ({ data }) => ({
        url: '/clients',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['clients'],
    }),
    registerClient: builder.mutation({
      query: ({ data }) => ({
        url: '/clients',
        method: 'POST',
        body: data,
      }),
    }),
    deleteClient: builder.mutation({
      query: ({ id }) => ({
        url: `/clients/${id}`, // Fix string interpolation
        method: 'DELETE',
      }),
      invalidatesTags: ['clients'],
    }),
    updateClient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/clients/${id}`, // Fix string interpolation
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'client', id },
        'clients',
      ],
    }),
  }),
});

export const {
  useGetSingleClientsQuery,
  usePostClientMutation,
  useGetSingleQuery,
  useRegisterClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useGetClientsQuery,
  useGetQuotationsEmailQuery,
} = userApi;
