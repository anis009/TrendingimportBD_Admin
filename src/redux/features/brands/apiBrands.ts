import { api } from '../../Api/api';

const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams();

        // Add pagination parameters
        if (params.page) queryString.append('page', params.page.toString());
        if (params.limit) queryString.append('limit', params.limit.toString());

        // Add filter parameters
        if (params.status) queryString.append('status', params.status);
        if (params.search) queryString.append('search', params.search);

        // Add sorting parameters
        if (params.sortBy) queryString.append('sortBy', params.sortBy);
        if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);

        const query = queryString.toString();
        return `/brand/all${query ? `?${query}` : ''}`;
      },
      providesTags: ['Brand'],
    }),
    getSingleBrand: builder.query({
      query: (id) => `/brand/get/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Brand', id }],
    }),
    createBrand: builder.mutation({
      query: ({ data }) => ({
        url: '/brand/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand/edit/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Brand', id: arg.id },
        'Brand',
      ],
    }),
    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        url: `/brand/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
