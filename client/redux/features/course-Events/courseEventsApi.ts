import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourseEvents: builder.mutation({
      query: (data) => ({
        url: "create-course-event",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getCourseAllEvents: builder.query({
      query: () => ({
        url: "adminGetCourseEvent",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    UserGetCourseEvent: builder.query({
      query: () => ({
        url: "UserGetCourseEvent",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourseEvent: builder.mutation({
      query: (id) => ({
        url: `deleteCourseEvent/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    editCourseEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `updateCourseEvent/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
   
  }),
});

export const {
  useCreateCourseEventsMutation,
  useGetCourseAllEventsQuery,
  useDeleteCourseEventMutation,
  useEditCourseEventMutation,
  useUserGetCourseEventQuery
  
} = coursesApi;
