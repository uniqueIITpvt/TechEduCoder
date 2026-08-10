require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import blogsModel from '../models/blogs.model';
import cloudinary from "cloudinary";

export const createBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data= req.body;

      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogs",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const blog = await blogsModel.create(data);

      res.status(201).json({
        success: true,
        blog,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }
);

// get all blogs
export const getAllBlogs = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await blogsModel.find();

      res.status(200).json({
        success: true,
        blogs,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// get blog details
export const getBlogDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const courseId = req.params.id;
      const blog = await blogsModel.findById(courseId);
      res.status(200).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit blogs

// export const editBlog = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const data = req.body;
//     const thumbnail = data.thumbnail;
//     const blogId = req.params.id;

//     // Check if blogId is provided
//     if (!blogId) {
//       return next(new ErrorHandler('Blog ID is missing', 400));
//     }

//     // Retrieve existing blog data
//     const blogData = await blogsModel.findById(blogId);

//     // Check if blog exists
//     if (!blogData) {
//       return next(new ErrorHandler('Blog not found', 404));
//     }

//     // If thumbnail is provided and not a URL starting with "https"
//     if (thumbnail  && !thumbnail.startsWith("https")) {
//       // Delete previous thumbnail from Cloudinary
//       await cloudinary.v2.uploader.destroy(blogData.thumbnail.public_id);

//       // Upload new thumbnail to Cloudinary
//       const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//         folder: "blogs",
//       });

//       // Update thumbnail data in request body
//       data.thumbnail = {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       };
//     } else if (thumbnail.startsWith("https")) {
//       // If thumbnail is a URL, retain existing thumbnail data
//       data.thumbnail = {
//         public_id: blogData.thumbnail.public_id,
//         url: blogData.thumbnail.url,
//       };
//     }

//     // Update the blog with new data
//     const updatedBlog = await blogsModel.findByIdAndUpdate(blogId, { $set: data }, { new: true });

//     // Send response with updated blog data
//     res.status(200).json({
//       success: true,
//       blog: updatedBlog,
//     });
//   } catch (error: any) {
//     // Handle errors
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// edit course
export const editBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
   

      if (!data.thumbnail) {
        return next(new ErrorHandler('Missing thumbnail property in request body', 400)); // Handle missing data gracefully
      }
    
      const blogId = req.params.id;

      const blogData = await blogsModel.findById(blogId) as any;

      if (  typeof thumbnail === 'string' && thumbnail &&   !thumbnail.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(blogData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "blogs",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if ( typeof thumbnail === 'string' && thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: blogData?.thumbnail.public_id,
          url: blogData?.thumbnail.url,
        };
      }

      const blog = await blogsModel.findByIdAndUpdate(
        blogId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        blog,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);



//  delete the blogs
export const deleteBlog = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const blogs = await blogsModel.findById(id);

      if (!blogs) {
        return next(new ErrorHandler("eBook not found", 404));
      }

      await blogs.deleteOne({ id });

     

      res.status(200).json({
        success: true,
        message: "blogs  deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAdminAllBlogs =  CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await blogsModel.find().sort({ createdAt: -1 });
  
      res.status(201).json({
        success: true,
        blogs,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
