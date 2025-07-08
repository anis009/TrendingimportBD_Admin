import { api } from '../../Api/api';

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/categories/list`,
      providesTags: ['categories'],
    }),
    getSingleCategory: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'category', id }],
    }),
    postCategory: builder.mutation({
      query: ({ data }) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['categories'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'category', id },
        'categories',
      ],
    }),
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
