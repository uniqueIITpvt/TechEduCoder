import { apiSlice } from "../api/apiSlice";

export const ebooksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEbook: builder.mutation({
      query: (data) => ({
        url: "create-ebook",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllEbooks: builder.query({
      query: () => ({
        url: "all-ebooks",
        method: "GET",
        credentials: "include",
      }),
    }),
    getEbook: builder.query({
      query: (ebookId) => ({
        url: `ebook-details/${ebookId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteEbook: builder.mutation({
      query: (id) => ({
        url: `delete-ebook/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    editEbook: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-ebook/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getAdminAllEbooks: builder.query({
      query: () => ({
        url: "all-admin-ebooks",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateEbookMutation,
  useGetAllEbooksQuery,
  useGetEbookQuery,
  useEditEbookMutation,
  useDeleteEbookMutation,
  useGetAdminAllEbooksQuery,
} = ebooksApi;
