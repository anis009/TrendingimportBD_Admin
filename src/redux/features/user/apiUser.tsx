import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (query) => `/users?userRole=${query.userRole}`,
      providesTags: ['users'],
    }),
    getSingleUsers: builder.query({
      query: (id) => `/users/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'user', id }],
    }),
    postUser: builder.mutation({
      query: ({ data }) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['users'],
    }),
    registerUser: builder.mutation({
      query: ({ data }) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`, // Fix string interpolation
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`, // Fix string interpolation
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'user', id }, 'users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  usePostUserMutation,
  useRegisterUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUsersQuery,
} = userApi;
