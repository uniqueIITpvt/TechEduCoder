import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./EbookDetails";
import {
  useCreatePaymentIntentMutation,
  useGetStripePublishablekeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import EbookDetails from "./EbookDetails";
import { useGetEbookQuery } from "@/redux/features/ebook/ebooksApi";

// type Props = {
//   id: string;
// };

// const EbookDetailsPage = ({ id }: Props) => {
//   const [route, setRoute] = useState("Login");
//   const [open, setOpen] = useState(false);
//   const { data, isLoading } = useGetEbookQuery(id);
//   const { data: config } = useGetStripePublishablekeyQuery({});
//   const [createPaymentIntent, { data: paymentIntentData }] =
//     useCreatePaymentIntentMutation();
//   const { data: userData } = useLoadUserQuery(undefined, {});
//   const [stripePromise, setStripePromise] = useState<any>(null);
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     if (config) {
//       const publishablekey = config?.publishablekey;
//       setStripePromise(loadStripe(publishablekey));
//     }
//     if (data && userData?.user) {
//       const amount = Math.round( 100);
//       createPaymentIntent(amount);
//     }
//   }, [config, data, userData]);
//   console.log(data)

//   useEffect(() => {
//     if (paymentIntentData) {
//       setClientSecret(paymentIntentData?.client_secret);
//     }
//   }, [paymentIntentData]);

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div>
//           <Heading
//             title={data.ebook.ebookTitle+ " -Unique IIT"}
//             description={
//               "unique iit is a programming community which is developed by shahriar sajeeb for helping programmers"
//             }
//             keywords={data?.course?.tags}
//           />
//           <Header
//             route={route}
//             setRoute={setRoute}
//             open={open}
//             setOpen={setOpen}
//             activeItem={1}
//           />
//           {stripePromise && (
//             <EbookDetails
//               data={data.ebook}
//               stripePromise={stripePromise}
//               clientSecret={clientSecret}
//               setRoute={setRoute}
//               setOpen={setOpen}
//             />
//           )}
//           <Footer />
//         </div>
//       )}
//     </>
//   );
// };

// export default EbookDetailsPage;

//

type Props = {
  id: string;
};

const EbookDetailsPage = ({ id }: Props) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  // const { data, isLoading } = useGetCourseDetailsQuery(id);
  // const { data: config } = useGetStripePublishablekeyQuery({});
  const [createPaymentIntent, { data: paymentIntentData }] =
    useCreatePaymentIntentMutation();

  const { data, isLoading } = useGetEbookQuery(id);
  const { data: config } = useGetStripePublishablekeyQuery({});
  const { data: userData } = useLoadUserQuery(undefined, {});
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishablekey = config?.publishablekey;
      setStripePromise(loadStripe(publishablekey));
    }
    if (data && userData?.user) {
      const amount = Math.round(data.ebook.estimatedPrice * 100);
      createPaymentIntent(amount);
    }
  }, [config, data, userData]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret);
    }
  }, [paymentIntentData]);
 

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.ebook.ebookTitle + " - UniqueIIT "}
            description={
              "ELearning is a programming community which is developed by Musharraf hussain for helping programmers"
            }
            keywords={data?.ebook?.level}
          />
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={3}
          />
          
          {stripePromise && (
            <EbookDetails
              data={data.ebook}
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              setRoute={setRoute}
              setOpen={setOpen}
            />
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default EbookDetailsPage;
