import React, { ChangeEvent, FormEvent, useState } from 'react';
import { styles } from '../styles/style';
import { useCreateMessageMutation } from '@/redux/features/contactUs/contactUsApi';
import { FcHome } from 'react-icons/fc';
import { FcIphone } from 'react-icons/fc';
import { FcInvite } from 'react-icons/fc';
import { FcIpad } from 'react-icons/fc';

const ContactUs = () => {
  const initialState = {
    name: '',
    email: '',
    phoneNo: '',
    subject: '',
    message: '',
  };

  const [createMessage, { data, error, isSuccess }] =
    useCreateMessageMutation();

  const [contactFormData, setContactFormData] = useState({ ...initialState });

  console.log(contactFormData);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e?.target;
    setContactFormData({ ...contactFormData, [name]: e.target.value });
  };

  const contactFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const resp = await createMessage({
      ...contactFormData,
      status: '',
      updateId: '',
      updatedAt: '',
      description: '',
    });
    console.log(resp);
    console.log('submitted🔥🔥🔥🔥🔥');
  };
  return (
    <div className='text-black dark:text-white'>
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        Get in
        <span className='text-gradient'>Touch</span>
      </h1>
      <h2 className='800px:!text-[25px] text-[15px] text-black dark:text-white font-[500] font-Poppins text-center py-2'>
        Looking for help? Fill the form and start a new adventure.
      </h2>

      <br />
      <div className='flex flex-col justify-start items-center gap-20 md:flex md:flex-row md:justify-center md:items-start md:mx-20 md:gap-40'>
        <div className='w-[95%] md:w-[50%]  shadow-xl rounded-xl border-t-4 border-t-[rgba(100,116,139,0.1)] dark:border-none mb-0 md:mb-20'>
          <section className='bg-white dark:bg-gray-900 rounded-xl'>
            <div className='py-8 lg:py-16 px-4 mx-auto max-w-screen-md'>
              <h2 className='mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white'>
                Let’s Connect
              </h2>
              {/* <p className='mb-8 lg:mb-16 font-Poppins text-center text-gray-500 dark:text-gray-400 sm:text-xl'>
                Got a technical issue? Want to send feedback about a beta
                feature? Need details about our Business plan? Let us know.
              </p> */}
              <form onSubmit={contactFormSubmit} className='space-y-8'>
                <div>
                  <label
                    htmlFor='fullName'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    Your Full Name
                  </label>
                  <input
                    type='text'
                    id='fullName'
                    name='name'
                    onChange={handleFormChange}
                    value={contactFormData?.name}
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
                    placeholder='Full Name'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    Your email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    onChange={handleFormChange}
                    value={contactFormData?.email}
                    className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
                    placeholder='name@flowbite.com'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='phoneNo'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    Phone Number
                  </label>
                  <input
                    type='number'
                    id='phoneNo'
                    name='phoneNo'
                    onChange={handleFormChange}
                    value={contactFormData?.phoneNo}
                    className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
                    placeholder='Your Phone Number (OPTIONAL)'
                  />
                </div>
                <div>
                  <label
                    htmlFor='subject'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    Subject
                  </label>
                  <input
                    type='text'
                    id='subject'
                    name='subject'
                    onChange={handleFormChange}
                    value={contactFormData?.subject}
                    className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
                    placeholder='Let us know how we can help you'
                    required
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='message'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400'
                  >
                    Your message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    onChange={handleFormChange}
                    value={contactFormData?.message}
                    rows={6}
                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    placeholder='Leave a comment...'
                  ></textarea>
                </div>
                <button
                  type='submit'
                  className='bg-gradient-to-r from-blue-500 to-[#521088] text-white py-3 px-5 text-sm font-medium text-center   dark:text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full'
                >
                  Send message
                </button>
              </form>
            </div>
          </section>
        </div>
        <div className='w-[95%] md:w-[50%] flex flex-col justify-start items-center gap-20 mb-20 md:mb-0 md:items-start'>
          <div className='flex justify-start gap-5'>
            <FcHome size={'2.5rem'} />
            <div>
              <h2 className='text-[30px] font-[900] font-Poppins'>
                Headquater
              </h2>
              <p className=''>Jaitpur Ext 2</p>
              <p>New Delhi 110044 India</p>
            </div>
          </div>
          <div className='flex justify-start gap-5'>
            <FcIpad size={'2.5rem'} />
            <div>
              <h2 className='text-[30px] font-[900] font-Poppins'>Phone</h2>
              <p className=''>+(91) 8877873229</p>
              <p>+(91) 8877873229</p>
            </div>
          </div>
          <div className='flex justify-start gap-5'>
            <FcInvite size={'2.5rem'} />
            <div>
              <h2 className='text-[30px] font-[900] font-Poppins'>Support</h2>
              <p className=''>support@uniqueiit.com</p>
              <p>info@uniqueiit.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
