import { apiSlice } from "../api/apiSlice";
 
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId }) => ({
        url: "create-order",
        body: { courseId },
        method: "POST",
        credentials: "include" as const,
      }),
    }),
    validateRazorpayPayment: builder.mutation({
      query: ({ razorpay_order_id, razorpay_payment_id, razorpay_signature  }) => ({
        url: `validate-order`,
        method: "POST",
        body: {
          razorpay_order_id, razorpay_payment_id, razorpay_signature 
        },
        credentials: "include" as const,
      }),
      
    }),
    
      
  }),
});


export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useValidateRazorpayPaymentMutation,
} = ordersApi;
