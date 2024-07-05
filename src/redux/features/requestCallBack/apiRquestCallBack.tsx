import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRequestCallBacks: builder.query({
      query: (query) => `/request_callback?type=${query.type}`,
      providesTags: ['requestcallbacks'],
    }),
    getMyRequestCallBacks: builder.query({
      query: (userId) => `/request_callback/assigned/${userId}`,
      providesTags: ['requestcallbacks'],
    }),
    getSingleRequestCallBacks: builder.query({
      query: (id) => `/request_callback/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'requestcallback', id }],
    }),
    getSingle: builder.query({
      query: (id) => `/request_callback/single/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'requestcallback', id }],
    }),
    postRequestCallBack: builder.mutation({
      query: ({ data }) => ({
        url: '/request_callback',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['requestcallbacks'],
    }),
    postCallbackToQuotations: builder.mutation({
      query: (id) => ({
        url: `/request_callback/callback_to_quotation/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['requestcallbacksToQuotations'],
    }),
    registerRequestCallBack: builder.mutation({
      query: ({ data }) => ({
        url: '/request_callback',
        method: 'POST',
        body: data,
      }),
    }),
    deleteRequestCallBack: builder.mutation({
      query: ({ id }) => ({
        url: `/request_callback/${id}`, // Fix string interpolation
        method: 'DELETE',
      }),
      invalidatesTags: ['requestcallbacks'],
    }),
    updateRequestCallBack: builder.mutation({
      query: ({ id, data }) => ({
        url: `/request_callback/${id}`, // Fix string interpolation
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'requestcallback', id },
        'requestcallbacks',
      ],
    }),
  }),
});

export const {
  useGetSingleRequestCallBacksQuery,
  usePostRequestCallBackMutation,
  usePostCallbackToQuotationsMutation,
  useGetSingleQuery,
  useRegisterRequestCallBackMutation,
  useDeleteRequestCallBackMutation,
  useUpdateRequestCallBackMutation,
  useGetRequestCallBacksQuery,
  useGetMyRequestCallBacksQuery,
} = userApi;
