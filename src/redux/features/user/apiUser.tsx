import { api } from '../../Api/api';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (query) => `/user?userRole=${query.userRole}`,
      providesTags: ['users'],
    }),
    getSingleUsers: builder.query({
      query: (id) => `/user/${id}`, // Fix string interpolation
      providesTags: (_result, _error, id) => [{ type: 'user', id }],
    }),
    postUser: builder.mutation({
      query: ({ data }) => ({
        url: '/user/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['users'],
    }),
    postAddUser: builder.mutation({
      query: ({ data }) => ({
        url: '/users/add_user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['addUser'],
    }),
    registerUser: builder.mutation({
      query: ({ data }) => ({
        url: '/user',
        method: 'POST',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/user/${id}`, // Fix string interpolation
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`, // Fix string interpolation
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
  usePostAddUserMutation,
  useRegisterUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetSingleUsersQuery,
} = userApi;
