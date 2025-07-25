import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams();

        // Add pagination parameters
        if (params.page) queryString.append('page', params.page.toString());
        if (params.limit) queryString.append('limit', params.limit.toString());

        // Add filter parameters
        if (params.status) queryString.append('status', params.status);
        if (params.search) queryString.append('search', params.search);
        if (params.userId) queryString.append('userId', params.userId);

        // Add sorting parameters
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);

        // Add date range parameters
        if (params.startDate) queryString.append('startDate', params.startDate);
        if (params.endDate) queryString.append('endDate', params.endDate);

        const query = queryString.toString();
        return `/order/orders${query ? `?${query}` : ''}`;
      },
      providesTags: ['order'],
    }),
    getMyOrders: builder.query({
      query: (id) => `/order/my-order/${id}`,
      providesTags: ['order'],
    }),
    getQuotationsEmail: builder.query({
      query: () => `/order/email`,
      providesTags: ['order'],
    }),
    getSingleOrder: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'order', id }],
    }),
    postOrder: builder.mutation({
      query: ({ data }) => ({
        url: '/order',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['order'],
    }),
    registerOrder: builder.mutation({
      query: ({ data }) => ({
        url: '/order',
        method: 'POST',
        body: data,
      }),
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['order'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/order/update-status/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'order', id: arg.id },
        'order',
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetQuotationsEmailQuery,
  useGetSingleOrderQuery,
  usePostOrderMutation,
  useRegisterOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = userApi;
