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
  }),
});

export const {
  usePostOrderMutation,
  useGetOrdersQuery,
} = orderApi;
