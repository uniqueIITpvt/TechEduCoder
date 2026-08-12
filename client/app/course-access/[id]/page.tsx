'use client'
import CourseContent from "@/app/components/Course/CourseContent";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { hasEntitlement } from "@/app/utils/entitlements";

type Props = {
    params:any;
}

const Page = ({params}: Props) => {
    const id = params.id;

  const { isLoading, error, data } = useLoadUserQuery(undefined, {});

  useEffect(() => {
    if (data?.user) {
      const isPurchased = hasEntitlement(data.user.courses, id);
      if (!isPurchased) {
        redirect("/");
      }
    }
    if (error) {
      redirect("/");
    }
  }, [data,error]);

  return (
   <>
   {
    isLoading || !data?.user ? (
        <Loader />
    ) : (
        <div>
          <CourseContent id={id} user={data.user} />
        </div>
    )
   }
    
   </>
  )
}

export default Page
