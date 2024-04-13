'use client';

import TinyEditor from '@/app/utils/tiny';
import { useCreateBlogMutation } from '@/redux/features/blogs/blogsApi';
import React, {

  FormEvent,
  SelectHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const BlogsAdmin = () => {
  const [createBlog, { data, error, isSuccess }] = useCreateBlogMutation();
 

  const initialState = {
    id: 0,
    authorName: '',
    Title: '',
    category: '',
    thumbnail: '',
    BlogContent: '',
  };
  const [blogFormData, setBlogFormData] = useState({ ...initialState });

  const [editorContent, setEditorContent] = useState('');
  const [avatar, setAvatar] = useState('');
 ;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setBlogFormData((prevFormData) => ({
      ...prevFormData,
      BlogContent: editorContent,
    }));

   
  }, [editorContent]);
  useEffect(() => {
    if (isSuccess) {
      toast.success("blog  uploaded successfully");
   
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);


  const handleThumbnailChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          // setAvatar(reader.result as string);
          setBlogFormData((prevFormData) => ({
            ...prevFormData,
            thumbnail: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogChange = (
    e: any
  ) => {
    const { name, value } = e.target;
    // setBlogFormData({ ...blogFormData, [name]: value });
    setBlogFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBlogSubmit = (e: FormEvent) => {
    e.preventDefault();
    createBlog(blogFormData);
    setBlogFormData({ ...initialState })


  };

  return (
    <>
      <div className='flex flex-col z-[20px] items-center mt-[1.25rem]'>
       
       
          <div
            // id='defaultModal'
            // tabIndex={-1}
            // aria-hidden='true'
            className='flex overflow-y-auto overflow-x-hidden  justify-center items-center w-full md:inset-0 h-modal md:h-full'
          >
            <div className='relative p-4 w-full max-w-2xl h-full md:h-auto'>
              <div className='relative p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:p-5'>
                <div className='flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    New Blog
                  </h3>
                 
                </div>
                <form>
                  <div className='grid gap-4 mb-4 sm:grid-cols-2'>
                  <div>
                      <label
                        htmlFor='name'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                      Id
                      </label>
                      <input
                        type='text'
                        name='id'
                        id='id'
                        value={blogFormData.id}
                        onChange={handleBlogChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Full Name'
                        required={true}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='name'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Author&apos;s Name
                      </label>
                      <input
                        type='text'
                        name='authorName'
                        id='authorName'
                        value={blogFormData.authorName}
                        onChange={handleBlogChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Full Name'
                        required={true}
                      />
                    </div>
                    {/* <div>
                      <label
                        htmlFor='brand'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Designation
                      </label>
                      <input
                        type='text'
                        name='designation'
                        id='designation'
                        value={blogFormData.designation}
                        onChange={handleBlogChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Your Designation'
                        required={true}
                      />
                    </div> */}
                    <div>
                      <label
                        htmlFor='price'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Blog Title
                      </label>
                      <input
                        type='text'
                        name='Title'
                        id='Title'
                        value={blogFormData.Title}
                        onChange={handleBlogChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                        placeholder='Enter Blog Title'
                        required={true}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='category'
                        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                      >
                        Category
                      </label>
                      <select
                        name='category'
                        id='category'
                        value={blogFormData.category}
                        onChange={handleBlogChange}
                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      >
                        <option selected={true}>Select category</option>
                        <option value='Web'>Web</option>
                        <option value='App'>App</option>
                        <option value='AI'>AI</option>
                        <option value='DevOPs'>DevOps</option>
                      </select>
                    </div>
                   
                    <div className='flex items-center justify-center w-full sm:col-span-2'>
                      <label
                        htmlFor='thumbnail'
                        className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 md:h-28'
                      >
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <svg
                            className='w-8 h-8 mb-[1px] text-gray-500 dark:text-gray-400'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 20 16'
                          >
                            <path
                              stroke='currentColor'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                            />
                          </svg>
                          <p className='block mb-[1px] text-lg font-semibold text-gray-900 dark:text-white'>
                            Upload Blog Thumbnail
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>
                              Click to upload
                            </span>{' '}
                            or drag and drop{' '}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </label>
                      <input
                        name='thumbnail'
                        id='thumbnail'
                        type='file'
                        className='hidden'
                        onChange={handleThumbnailChange}
                      />
                    </div>
                   
                  
                   
                    <div className='sm:col-span-2 dark:bg-gray-700 rounded-xl'>
                    <h1 className='text-[17px] p-2'>Blogs content </h1>
                      <TinyEditor
                        editorContent={editorContent}
                        setEditorContent={setEditorContent}
                      />
                    </div>
                  </div>
                 
                  <div className=' w-[60%] m-auto flex justify-between'>
                
                  <button
                    onClick={handleBlogSubmit}
                    // type='submit'
                    className='text-white inline-flex justify-center items-center bg-[#331cb9] hover:bg-[#5875f5] focus:ring-4 focus:outline-none focus:ring-[#dad6d6] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#b19494] dark:hover:bg-[#cfb3b3] dark:focus:ring-[#c4aaaa] ml-0 w-full mt-7 md:mt-0 md:ml-10 md:w-fit'
                  >
                  Submit 
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setBlogFormData({ ...initialState });
                      setEditorContent('');
                    }}
                    // type='submit'
                    className='text-white inline-flex justify-center items-center bg-[#b91c1c] hover:bg-[#b91c1c] focus:ring-4 focus:outline-none focus:ring-[#7f1d1d] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#b91c1c] dark:hover:bg-[#b91c1c] dark:focus:ring-[#7f1d1d] ml-0 w-full mt-7 md:mt-0 md:ml-10 md:w-fit'
                  >
                    <svg
                      className='mr-1 -ml-1 w-6 h-6'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                        clip-rule='evenodd'
                      ></path>
                    </svg>
                    Reset Form
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        
      </div>
    </>
  );
};

export default BlogsAdmin;
