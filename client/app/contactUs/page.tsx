'use client';
import React, { useState } from 'react';
import Heading from '../utils/Heading';
import Header from '../components/Header';
import ContactUs from './ContactUs';
import Footer from '../components/Footer';

type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(7);
  const [route, setRoute] = useState('Login');

  return (
    <div>
      <Heading
        title='About us - Elearning'
        description='Elearning is a learning management system for helping programmers.'
        keywords='programming,mern'
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <ContactUs />
      
      <Footer open={open} setOpen={setOpen} setRoute={setRoute} route={route} />
    </div>
  );
};

export default Page;
