require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";
export interface IEbook extends Document {
  id: number;
  authorName: string;
  category: string;
  ebookTitle: string;
  ebookpdf: {
    public_id: string;
    url: string;
    resource_type?: string;
    delivery_type?: string;
  };
  // ebookPDF: {
  //   public_id: string; // Cloudinary public ID for the eBook PDF
  //   url: string; // Cloudinary URL for the eBook PDF
  // };
  level: string;

   thumbnail: Object;
   
  ratings?: number;
  reviews: IReview[];
  originalPrice: number;
  discountPrice: number;
  purchased: number;
  aboutEbooks:string
}

interface IReview extends Document {
  user: IUser;
  rating?: number;
  comment: string;
  commentReplies?: IReview[];
}

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const ebookSchema: Schema<IEbook> = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    authorName: {
      type: String,
      required: [true, "Please enter author's name"],
    },
    category: {
      type: String,
      required: [true, "Please enter the category of the eBook"],
    },
    ebookTitle: {
      type: String,
      required: [true, "Please enter the title of the eBook"],
    },
    // ebookpdf: {
    //   type: Object,
    // },
    ebookpdf: {
      public_id: {
        type: String,
        required: [true, "Cloudinary public_id is required"],
      },
      url: {
        type: String,
        required: [true, "Cloudinary URL is required"],
      },
      resource_type: String,
      delivery_type: String,
    },
    level: {
      type: String,
        required: [true, "Please enter the level of the eBook"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    aboutEbooks:{
      type:String,
      required:true
    },
    thumbnail: {
      public_id: {
        type: String,
         required: [true, "Cloudinary public_id for the thumbnail is required"],
      },
      url: {
        type: String,
         required: [true, "Cloudinary URL for the thumbnail is required"],
      },
    },
    reviews: [reviewSchema],
    originalPrice: {
      type:Number,
      required:true
    },
    discountPrice: {
       type: Number,
       required: true
    },
    purchased:{
      type: Number,
      default: 0,
     },
  },
  { timestamps: true }
);

const EbookModel: Model<IEbook> = mongoose.model("Ebook", ebookSchema);

export default EbookModel;
