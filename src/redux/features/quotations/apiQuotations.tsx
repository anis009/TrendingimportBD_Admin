import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuotations: builder.query({
      query: () => `/quotations`,
      providesTags: ['quotations'],
    }),

    getSingleQuotation: builder.query({
      query: (id) => `/quotations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'quotation', id }],
    }),
    postQuotation: builder.mutation({
      query: ({ data }) => ({
        url: '/quotations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['quotations'],
    }),
    deleteQuotation: builder.mutation({
      query: ({ id }) => ({
        url: `/quotations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['quotations'],
    }),
    updateQuotation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quotations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'quotation', id },
        'quotations',
      ],
    }),
  }),
});

export const {
  useGetSingleQuotationQuery,
  usePostQuotationMutation,
  useDeleteQuotationMutation,
  useUpdateQuotationMutation,
  useGetQuotationsQuery,
} = userApi;
