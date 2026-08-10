import { styles } from '@/app/styles/style';
import React from 'react';

const CommentForm = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-[26px] font-[700] font-poppins mb-4">Leave a Reply</h2>
      <p className="text-gray-600 text-[17px] font-poppins font-[500] mb-4">Your email address will not be published. Required fields are marked *</p>

      <form className="space-y-4">
        <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              placeholder="Enter Email"
              required
            />
          </div>
        </div>
      
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter Comments"
            rows={4}
          ></textarea>
        </div>
        <button
        className={`${styles.button}`}
          // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
