import { apiSlice } from '../api/apiSlice';
import {
  userLoggedIn,
  userLoggedOut,
  userRegistration,
} from '../auth/authSlice';

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const blogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    createBlog: builder.mutation({
      query: (data) => ({
        url: 'create-blog',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
      // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      //   try {
      //     const result = await queryFulfilled;
      //     dispatch(
      //       userRegistration({
      //         token: result.data.activationToken,
      //       })
      //     );
      //   } catch (error: any) {
      //     console.log(error);
      //   }
      // },
    }),
    getAllBlogs: builder.query({
      query: () => ({
        url: 'all-blogs',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    getBlog: builder.query({
      query: (id: string) => ({
        url: `blog-details/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `delete-blog/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
   
    editBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-blog/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getAdminAllBlog: builder.query({
      query: () => ({
        url: "all-admin-blogs",
        method: "GET",
        credentials: "include",
      }),
    }),
   

  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogQuery,
  useDeleteBlogMutation,
  useEditBlogMutation,
  useGetAdminAllBlogQuery,
} = blogsApi;
