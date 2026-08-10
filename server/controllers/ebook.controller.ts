require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import EbookModel from "../models/ebook.model"; // Adjust the path as per your project structure
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";
import { redis } from "../utils/redis";

  export const createEbook = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const ebookData = req.body;
        // Assuming you have already handled file upload to Cloudinary and set the public_id and URL in ebookData
        const thumbnail = ebookData.thumbnail;
        if (thumbnail) {
          const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            folder: "ebook",
          });
  
          ebookData.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }

        const ebookpdf = ebookData.ebookpdf;
        if (ebookpdf) {
          const myCloud = await cloudinary.v2.uploader.upload(ebookpdf, {
            folder: "ebooksss",
          });
  
          ebookData.ebookpdf = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
        
        const ebook = await EbookModel.create(ebookData);
        
       res.status(201).json({
          success: true,
          ebook,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
export const getAllEbooks = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ebooks = await EbookModel.find();

      res.status(200).json({
        success: true,
        ebooks,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getEbookDetails = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ebookId = req.params.id;
      const ebook = await EbookModel.findById(ebookId);

      if (!ebook) {
        return next(new ErrorHandler("Ebook not found", 404));
      }

      res.status(200).json({
        success: true,
        ebook,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// edit ebooks
export const editEbook = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;
      const ebookpdf = data.ebookpdf;
     
      const eBookId = req.params.id;

      const eBookeData = await EbookModel.findById(eBookId) as any;

      if (typeof thumbnail === 'string' && thumbnail && !thumbnail.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(eBookeData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
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

      if (typeof ebookpdf === 'string' && ebookpdf && !ebookpdf.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(eBookeData.ebookpdf.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(ebookpdf, {
          folder: "ebooksss",
        });

        data.ebookpdf = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (typeof ebookpdf === 'string' && ebookpdf.startsWith("https")) {
        data.ebookpdf = {
          public_id: eBookeData.ebookpdf.public_id,
          url: eBookeData.ebookpdf.url,
        };
      }

      const eBook = await EbookModel.findByIdAndUpdate(
        eBookId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        eBook,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// Delete Cebooks--- only for admin
export const deleteEbook = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const Ebook = await EbookModel.findById(id);

      if (!Ebook) {
        return next(new ErrorHandler("eBook not found", 404));
      }

      await Ebook.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: "course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
// get all Ebooks  --- only for admin
export const getAdminAllEbooks = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Ebooks = await EbookModel.find().sort({ createdAt: -1 });
  
      res.status(201).json({
        success: true,
        Ebooks,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
