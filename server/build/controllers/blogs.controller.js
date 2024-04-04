"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAllBlogs = exports.deleteBlog = exports.editBlog = exports.getBlogDetails = exports.getAllBlogs = exports.createBlog = void 0;
require('dotenv').config();
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const blogs_model_1 = __importDefault(require("../models/blogs.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.createBlog = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "blogs",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const blog = await blogs_model_1.default.create(data);
        res.status(201).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error, 400));
    }
});
// get all blogs
exports.getAllBlogs = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const blogs = await blogs_model_1.default.find();
        res.status(200).json({
            success: true,
            blogs,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get blog details
exports.getBlogDetails = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const blog = await blogs_model_1.default.findById(courseId);
        res.status(200).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
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
exports.editBlog = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (!data.thumbnail) {
            return next(new ErrorHandler_1.default('Missing thumbnail property in request body', 400)); // Handle missing data gracefully
        }
        const blogId = req.params.id;
        const blogData = await blogs_model_1.default.findById(blogId);
        if (typeof thumbnail === 'string' && thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary_1.default.v2.uploader.destroy(blogData.thumbnail.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "blogs",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (typeof thumbnail === 'string' && thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: blogData?.thumbnail.public_id,
                url: blogData?.thumbnail.url,
            };
        }
        const blog = await blogs_model_1.default.findByIdAndUpdate(blogId, {
            $set: data,
        }, { new: true });
        res.status(201).json({
            success: true,
            blog,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//  delete the blogs
exports.deleteBlog = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const blogs = await blogs_model_1.default.findById(id);
        if (!blogs) {
            return next(new ErrorHandler_1.default("eBook not found", 404));
        }
        await blogs.deleteOne({ id });
        res.status(200).json({
            success: true,
            message: "blogs  deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAdminAllBlogs = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const blogs = await blogs_model_1.default.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            blogs,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
