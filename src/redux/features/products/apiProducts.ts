import { api } from '../../Api/api';
import { IProduct, IProductFormData } from '../../../types/product';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

const apiProducts = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<ApiResponse<IProduct[]>, void>({
      query: () => '/product/all',
      providesTags: ['products'],
    }),

    // Get single product
    getProduct: builder.query<ApiResponse<IProduct>, string>({
      query: (id) => `/product/single-product/${id}`,
      providesTags: ['product'],
    }),

    // Create product
    postProduct: builder.mutation<
      ApiResponse<IProduct>,
      { data: IProductFormData }
    >({
      query: ({ data }) => ({
        url: '/product/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['products'],
    }),

    // Update product
    updateProduct: builder.mutation<
      ApiResponse<IProduct | any>,
      { id: string; data: Partial<IProductFormData | any> }
    >({
      query: ({ id, data }) => ({
        url: `/product/edit-product/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['products', 'product'],
    }),

    // Delete product
    deleteProduct: builder.mutation<ApiResponse<void>, { id: string }>({
      query: ({ id }) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),

    // Get products by category
    getProductsByCategory: builder.query<ApiResponse<IProduct[]>, string>({
      query: (categoryId) => `/product/category/${categoryId}`,
      providesTags: ['products'],
    }),

    // Get products by subcategory
    getProductsBySubCategory: builder.query<ApiResponse<IProduct[]>, string>({
      query: (subCategoryId) => `/product/subcategory/${subCategoryId}`,
      providesTags: ['products'],
    }),

    // Get featured products
    getFeaturedProducts: builder.query<ApiResponse<IProduct[]>, void>({
      query: () => '/product/featured',
      providesTags: ['products'],
    }), // Update product status
    updateProductStatus: builder.mutation<
      ApiResponse<IProduct>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/product/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['products', 'product'],
    }),
    uploadProductImage: builder.mutation<
      ApiResponse<{ url: string; filename: string }>,
      FormData
    >({
      query: (formData) => ({
        url: 'https://media.trendingimportbd.com/api/v1/upload/media',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  usePostProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
  useGetProductsBySubCategoryQuery,
  useGetFeaturedProductsQuery,
  useUpdateProductStatusMutation,
  useUploadProductImageMutation,
} = apiProducts;
