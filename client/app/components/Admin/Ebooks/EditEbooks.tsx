"use client";
import React, { FC, use, useEffect, useState } from "react";
   import { useEditEbookMutation ,useGetAdminAllEbooksQuery } from "@/redux/features/ebook/ebooksApi";
 import toast, { Toast } from "react-hot-toast";
import { redirect } from "next/navigation";
   type Props = {
    id:any
}

const EditEbooks:FC<Props> = ({id}) => {
    const [ editEbook,{isSuccess,error}] = useEditEbookMutation();
    const { data, refetch } = useGetAdminAllEbooksQuery(
        {},
        { refetchOnMountOrArgChange: true }
      );



 
    const editEbookData = data && data.ebooks.find((i:any) => i._id === id);
    
   
    useEffect(() => {
      if (isSuccess) {
        toast.success("ebook Updated successfully");
     
      }
      if (error) {
        if ("data" in error) {
          const errorMessage = error as any;
          toast.error(errorMessage.data.message);
        }
      }
    }, [isSuccess, error]);
 
      
  

 

    useEffect(() => {
      setEbookData((prevFormData) => ({
        ...prevFormData,
        id: editEbookData.id,
        authorName: editEbookData.authorName,
        ebookTitle: editEbookData.ebookTitle,
        category: editEbookData.category,
        level: editEbookData.level,
        thumbnail: editEbookData.thumbnail,
        originalPrice: editEbookData.originalPrice,
        estimatedPrice: editEbookData.estimatedPrice,
        ebookpdf: editEbookData.ebookpdf,
        aboutEbooks: editEbookData.aboutEbooks
      }));
    }, [editEbookData]);
    
    const initialState = {
      id:0,
      authorName: "",
      ebookTitle: "",
      category: "",
      level: "",
      thumbnail: "",
      originalPrice: 0,
      estimatedPrice: 0,
      ebookpdf: "",
      aboutEbooks:""
    };
    
    const [ebookData, setEbookData] = useState({ ...initialState });
    
    
    const handleEbookChange = (
      e: any
    ) => {
      const { name, value } = e.target;
      // setBlogFormData({ ...blogFormData, [name]: value });
      setEbookData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };
  
    const handleThumbnailChange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          if (reader.readyState === 2) {
            // setAvatar(reader.result as string);
            setEbookData((prevFormData) => ({
              ...prevFormData,
              thumbnail: reader.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    const handlePDFChange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          if (reader.readyState === 2) {
            // setAvatar(reader.result as string);
            setEbookData((prevFormData) => ({
              ...prevFormData,
              ebookpdf: reader.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
   
    useEffect(() => {
      if (data) {
        const ebookToEdit = data.ebooks.find((i: any) => i._id === id);
        if (ebookToEdit) {
          setEbookData(ebookToEdit);
        }
      }
    }, []);
  
   
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      const data = ebookData;
      await  editEbook({id:editEbookData?._id,data});
      // Yahaan aap file ko server par upload karne ka logic likh sakte hain
     
    };

   
 
      return (
        <>
          <div
            // id='defaultModal'
            // tabIndex={-1}
            // aria-hidden='true'
            className="flex overflow-y-auto overflow-x-hidden  justify-center items-center w-full md:inset-0 h-modal md:h-full"
          >
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
              <div className="relative p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ebook Upload
                  </h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Id
                      </label>
                      <input
                        type="number"
                        name="id"
                        id="id"
                        value={ebookData.id || ''}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Full Name"
                        required={true}
                      />
                    </div>
                  
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                Author name
                      </label>
                      <input
                        type="text"
                        name="authorName"
                        id="authorName"
                        value={ebookData.authorName}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Full Name"
                        required={true}
                      />
                    </div>
                 
                    <div className="flex justify-between items-center">
                    <div className="w-[40%]">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Original price 
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        id="originalPrice"
                        value={ebookData.originalPrice
                          }
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter Blog Title"
                        required={true}
                      />
                    </div>
                    <div className="w-[40%]">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                      Estimated price 
                      </label>
                      <input
                        type="number"
                        name="estimatedPrice"
                        id="estimatedPrice"
                        value={ebookData.estimatedPrice}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter Blog Title"
                        required={true}
                      />
                    </div>
    
                    </div>
    
                    <div>
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Ebook Title
                      </label>
                      <input
                        type="text"
                        name="ebookTitle"
                        id="ebookTitle"
                        value={ebookData.ebookTitle}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Enter Blog Title"
                        required={true}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={ebookData.category}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option selected={true}>Select category</option>
                        <option value="Programing">Programing</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Graphic Designer">Graphic Designer</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Machine Learning">Machine Learning</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Level
                      </label>
                      <select
                        name="level"
                        id="level"
                        value={ebookData.level}
                        onChange={handleEbookChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option selected={true}>Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-center w-full sm:col-span-2">
                      <label
                        htmlFor="thumbnail"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 md:h-28"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-[1px] text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="block mb-[1px] text-lg font-semibold text-gray-900 dark:text-white">
                            Upload Blog Thumbnail
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>{" "}
                            or drag and drop{" "}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </label>
                      <input
                        name="thumbnail"
                        id="thumbnail"
                        type="file"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                      about books
                      </label>
                      <textarea
                     rows={4}
                        name="aboutEbooks"
                        id="aboutEbooks"
                        value={ebookData.aboutEbooks}
                        onChange={handleEbookChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder={`Write Blog's Short Description`}
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-center w-full sm:col-span-2">
                      <label
                        htmlFor="ebookpdf"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 md:h-28"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-[1px] text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="block mb-[1px] text-lg font-semibold text-gray-900 dark:text-white">
                            Upload Ebook
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>{" "}
                            or drag and drop{" "}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, Docs
                          </p>
                        </div>
                      </label>
                      <input
                        name="ebookpdf"
                        id="ebookpdf"
                        type="file"
                        className="hidden"
                        onChange={handlePDFChange}
                      />
                    </div>
                    <button
                      type="submit"
                      className="  text-black  m-auto border-2 border-emerald-400 mt-5 inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full md:w-fit"
                    >
                      update Ebook
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      );
}

export default EditEbooks
