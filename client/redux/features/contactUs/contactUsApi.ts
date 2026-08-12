import { apiSlice } from '../api/apiSlice';
export const contactUsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    createMessage: builder.mutation({
      query: (data) => ({
        url: 'create-message',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateMessageMutation,
} = contactUsApi;
