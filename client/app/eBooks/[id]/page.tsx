'use client'
import React from "react";
import EbookDetailsPage from "../../components/eBooks/EbookDetailsPage";


const Page = ({params}:any) => {
    return (
        <div>
            <EbookDetailsPage id={params.id} />
        </div>
    )
}

export default Page;