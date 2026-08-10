'use client';

import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Image from 'next/image';
import { useState } from 'react';
import BlogDetails from './BlogDetails';

export type paramsType = {
  params: { blogId: String };
};

const Page = ({ params }: paramsType) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(3);
  const [route, setRoute] = useState('Login');

  return (
    <>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <BlogDetails params={params} />
      <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
    </>
  );
};

export default Page;
