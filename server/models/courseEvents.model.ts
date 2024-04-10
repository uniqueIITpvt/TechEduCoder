import mongoose, { Document, Model, Schema, Types } from "mongoose";
import CourseModel from "./course.model";
import { IUser } from "./user.model";
export interface ICourseEvent extends Document {
  id: number;
  user: IUser;
  eventName: string;
  eventsType: string;
  eventPercentage: number;
  filteredCourseId: Array<{ courseId: string }>;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  updatedBy: string;
}
const CourseEventSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user: Object,
    eventsName: {
      type: String,
      required: true,
    },
    eventsType: {
      type: String,
      required: true,
    },
    eventPercentage: {
      type: Number,
      required: true,
    },
    filteredCourseId: [
      {
        courseId: {
          type: String, // Change type to String
          required: true, // Optionally, add required validation
        },
      },
    ],
    startDate: {
      type: Date,
      // required: true
    },
    endDate: {
      type: Date,
      // required: true
    },
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },

  { timestamps: true }
);

export const CourseEvent = mongoose.model<ICourseEvent>(
  "CourseEvent",
  CourseEventSchema
);
