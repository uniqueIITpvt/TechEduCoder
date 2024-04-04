"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAllEbooks = exports.deleteEbook = exports.editEbook = exports.getEbookDetails = exports.getAllEbooks = exports.createEbook = void 0;
require("dotenv").config();
const ebook_model_1 = __importDefault(require("../models/ebook.model")); // Adjust the path as per your project structure
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("../utils/redis");
exports.createEbook = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const ebookData = req.body;
        // Assuming you have already handled file upload to Cloudinary and set the public_id and URL in ebookData
        const thumbnail = ebookData.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "ebook",
            });
            ebookData.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const ebookpdf = ebookData.ebookpdf;
        if (ebookpdf) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(ebookpdf, {
                folder: "ebooksss",
            });
            ebookData.ebookpdf = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const ebook = await ebook_model_1.default.create(ebookData);
        res.status(201).json({
            success: true,
            ebook,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getAllEbooks = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const ebooks = await ebook_model_1.default.find();
        res.status(200).json({
            success: true,
            ebooks,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getEbookDetails = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const ebookId = req.params.id;
        const ebook = await ebook_model_1.default.findById(ebookId);
        if (!ebook) {
            return next(new ErrorHandler_1.default("Ebook not found", 404));
        }
        res.status(200).json({
            success: true,
            ebook,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// edit course
exports.editEbook = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const ebookpdf = data.ebookpdf;
        console.log(data);
        console.log(thumbnail);
        const eBookId = req.params.id;
        const eBookeData = await ebook_model_1.default.findById(eBookId);
        if (typeof thumbnail === 'string' && thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary_1.default.v2.uploader.destroy(ebookpdf.thumbnail.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "ebooksss",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (typeof thumbnail === 'string' && thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: eBookeData?.thumbnail.public_id,
                url: eBookeData?.thumbnail.url,
            };
        }
        if (ebookpdf && !ebookpdf.startsWith("https")) {
            await cloudinary_1.default.v2.uploader.destroy(ebookpdf.ebookpdf.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(ebookpdf, {
                folder: "ebooksss",
            });
            data.ebookpdf = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (ebookpdf.startsWith("https")) {
            data.ebookpdf = {
                public_id: ebookpdf?.thumbnail.public_id,
                url: ebookpdf?.thumbnail.url,
            };
        }
        const eBook = await ebook_model_1.default.findByIdAndUpdate(eBookId, {
            $set: data,
        }, { new: true });
        res.status(201).json({
            success: true,
            eBook,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Delete Cebooks--- only for admin
exports.deleteEbook = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const Ebook = await ebook_model_1.default.findById(id);
        if (!Ebook) {
            return next(new ErrorHandler_1.default("eBook not found", 404));
        }
        await Ebook.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get all Ebooks  --- only for admin
exports.getAdminAllEbooks = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const Ebooks = await ebook_model_1.default.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            Ebooks,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
