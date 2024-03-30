import { api } from '../../Api/api';

const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => `/orders`,
      providesTags: ['orders'],
    }),
    postOrder: builder.mutation({
      query: ({ data }) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['orders'],
    }),
    updateOrder: builder.mutation({
      query: ({ data, id }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['orders'],
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders'],
    }),
  }),
});

export const {
  usePostOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
