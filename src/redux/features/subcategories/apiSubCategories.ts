import { api } from '../../Api/api';

const subCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => `/subcategories/list`,
      providesTags: ['subcategories'],
    }),
    getSubCategoriesByCategory: builder.query({
      query: (categoryId) => `/subcategories/by-category/${categoryId}`,
      providesTags: (_result, _error, categoryId) => [
        { type: 'subcategories-by-category', id: categoryId },
      ],
    }),
    getSingleSubCategory: builder.query({
      query: (id) => `/subcategories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'subcategory', id }],
    }),
    postSubCategory: builder.mutation({
      query: ({ data }) => ({
        url: '/subcategories/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['subcategories'],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subcategories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'subcategory', id },
        'subcategories',
      ],
    }),
    deleteSubCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/subcategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subcategories'],
    }),
    // Item management within subcategories
    addItemToSubCategory: builder.mutation({
      query: ({ subCategoryId, data }) => ({
        url: `/subcategories/${subCategoryId}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { subCategoryId }) => [
        { type: 'subcategory', id: subCategoryId },
        'subcategories',
      ],
    }),
    updateItemInSubCategory: builder.mutation({
      query: ({ subCategoryId, itemId, data }) => ({
        url: `/subcategories/${subCategoryId}/items/${itemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { subCategoryId }) => [
        { type: 'subcategory', id: subCategoryId },
        'subcategories',
      ],
    }),
    deleteItemFromSubCategory: builder.mutation({
      query: ({ subCategoryId, itemId }) => ({
        url: `/subcategories/${subCategoryId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { subCategoryId }) => [
        { type: 'subcategory', id: subCategoryId },
        'subcategories',
      ],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetSingleSubCategoryQuery,
  usePostSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useAddItemToSubCategoryMutation,
  useUpdateItemInSubCategoryMutation,
  useDeleteItemFromSubCategoryMutation,
} = subCategoryApi;
