require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

export interface IBlog extends Document {
  id: number;
  authorName: string;
  Title: string;
  category: string;

  thumbnail: object;

  BlogContent: string;
  questions: IComment[];
}
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
},{timestamps:true});

const blogSchema: Schema<IBlog> = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    authorName: {
      type: String,
      required: [true, "Please enter writer's name"],
    },
    Title: {
      type: String,
      required: [true, "Please enter blog title"],
    },
    category: {
      type: String,
      required: [true, "Please enter blog category"],
    },

    // thumbnail: {
    //   type: String,
    //   required: [true, 'Please upload thumbnail'],
    // },

    thumbnail: {
      public_id: {
        type: String,
        require:true
      },
      url: {
        type: String,
        require:true
      },
    },
    BlogContent: {
      type: String,
      required: [true, "Please enter full description"],
    },
    questions: [commentSchema],
  },
  { timestamps: true },
  
);

const blogsModel: Model<IBlog> = mongoose.model("Blog", blogSchema);

export default blogsModel;
