require("dotenv").config();
import { Request, Response, NextFunction, response } from "express";
import CourseModel from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { redis } from "../utils/redis";
import { CourseEvent } from "../models/courseEvents.model";

export const createCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filteredCourseId, eventsType, eventPercentage, id, eventsName } =
        req.body;

      if (!req.body) {
        return next(new ErrorHandler("data not found ", 400));
      }

      const updatedCourses = await Promise.all(
        filteredCourseId.map(async ({ courseId }) => {
          // Extract courseId from each object
          // Find the course by ID
          const course = await CourseModel.findById(courseId);

          if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
          }
          // if isEvent true then show error
          if (course.isEvent) {
            return next(
              new ErrorHandler(`event already Running in this course`, 400)
            );
          }
          // Calculate the new price based on the discount percentage
          const percentage = eventPercentage;
          const discountAmount = course.discountPrice * (percentage / 100);
          const newPrice = course.discountPrice - discountAmount;

          // Update the course with the new price and set isEvent to true
          return CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { discountPrice: newPrice, isEvent: true } },
            { new: true }
          );
        })
      );

      // Construct the object to create a new CourseEvent
      const courseEvent = await CourseEvent.create({
        eventPercentage,
        eventsType,
        id,
        eventsName,
        filteredCourseId,
        // Add any other fields that are required and present in the schema
      });

      res.status(201).json({
        success: true,
        courseEvent,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all course events for Admin
export const adminGetCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseEvent = await CourseEvent.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        courseEvent,
      });
    } catch (error) {}
  }
); 
// delete the courseEvent 

export const deleteCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const courseEvent = await CourseEvent.findById(id);
      if (!courseEvent) {
        return next(new ErrorHandler("courseevent not found", 400));
      }
      const updatedCourses = await Promise.all(
        courseEvent.filteredCourseId.map(async ({ courseId }) => {
          const courses = await CourseModel.findById(courseId);

          if (!courses) {
            return next(
              new ErrorHandler(`Course with ID ${courseId} not found `, 400)
            );
          }
          if (!courses.isEvent) {
            return next(
              new ErrorHandler(
                `course isevent with ID ${courseId} is not true `,
                400
              )
            );
          }

          // calculate the discount price from percentage
          const percentage = courseEvent.eventPercentage;
          const discountAmount = courses.discountPrice;

          const originalPrice = discountAmount / (1 - percentage / 100);
          return CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { discountPrice: originalPrice, isEvent: false } },
            { new: true }
          );
        })
      );
      await courseEvent.deleteOne({ id });

      res.status(200).json({
        success: true,
        message: "delet events  successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update the course Event 
export const updateCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming the ID of the CourseEvent to update is passed in the URL as a parameter
      const courseEventId = req.params.id;
      const { eventsType, eventPercentage, eventsName, filteredCourseId } = req.body;

      // Find the CourseEvent by ID
      const courseEvent = await CourseEvent.findById(courseEventId);
      if(!courseEvent){
        return next(new ErrorHandler("course event id not found " , 400))
      }
     

      const updatedCourses = await Promise.all(
        courseEvent.filteredCourseId.map(async ({ courseId }) => {
          // Extract courseId from each object
          // Find the course by ID
          const course = await CourseModel.findById(courseId);

          if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
          }
          if(!course.isEvent){
            return next(new ErrorHandler(`course not found ${course}` ,400))
          }
        
          
        
          // calculate the discount price from percentage  that what was the real price before given offer and the we will update blew
           const percentages = courseEvent.eventPercentage;
           const discountPrice  = course.discountPrice;

           const originalPrice = discountPrice  / (1 - percentages / 100);
        
        
          // Calculate the new price based on the discount percentage for updated percentage 
          const percentage = eventPercentage;
          const discountAmount =  originalPrice  * (percentage / 100);
          const newPrice =  originalPrice  - discountAmount;

          // Update the course with the new price and set isEvent to true
          return CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { discountPrice: newPrice, isEvent: true } },
            { new: true }
          );
        })
      );

      if (!courseEvent) {
        return next(new ErrorHandler(`CourseEvent with ID ${courseEventId} not found`, 404));
      }

      const updatedCourseEvent = await CourseEvent.findByIdAndUpdate(
        courseEventId,
        {
          $set: {
            eventsType,
            eventPercentage,
            eventsName,
            filteredCourseId,
            // Include any other fields you want to update
          },
        },
        { new: true } // Return the modified document rather than the original
      );

      res.status(200).json({
        success: true,
        message: 'CourseEvent updated successfully',
        updatedCourseEvent,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


