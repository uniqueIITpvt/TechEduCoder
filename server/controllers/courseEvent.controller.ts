require("dotenv").config();
import { Request, Response, NextFunction, response } from "express";
import CourseModel from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { CourseEvent } from "../models/courseEvents.model";
import mongoose from "mongoose";

export const createCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const {
        filteredCourseId,
        eventsType,
        eventPercentage,
        id,
        eventsName,
        startDate,
        endDate,
      } = req.body;

      if (!req.body) {
        throw new ErrorHandler("data not found", 400);
      }

      // Check courses existence and event status before any update
      const coursesCheck = await Promise.all(
        filteredCourseId.map(({ courseId }) =>
          CourseModel.findById(courseId).session(session)
        )
      );

      const invalidCourses = coursesCheck.filter(
        (course) => !course || course.isEvent
      );
      if (invalidCourses.length > 0) {
        const errors = invalidCourses
          .map((course) => {
            if (!course) {
              return "Some courses not found";
            } else if (course.isEvent) {
              return `Event already running in course with ID: ${course.id}`;
            }
          })
          .join("; ");

        return next(new ErrorHandler(errors, 400));
      }

      // Update courses if validations pass
      await Promise.all(
        filteredCourseId.map(({ courseId }) => {
          const course = coursesCheck.find(
            (course) => String(course._id) === courseId
          );
          const discountAmount = course.discountPrice * (eventPercentage / 100);
          const newPrice = course.discountPrice - discountAmount;

          return CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { discountPrice: newPrice, isEvent: true } },
            { new: true, session }
          );
        })
      );

      const courseEvent = await CourseEvent.create(
        [
          {
            eventPercentage,
            eventsType,
            id,
            eventsName,
            filteredCourseId,
            startDate,
            endDate,
          },
        ],
        { session: session }
      );

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        data: courseEvent,
      });
    } catch (error: any) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
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
    } catch (error) {
      return next(new ErrorHandler(`error is ${error}`, 400));
    }
  }
);  
// user get all events
export const UserGetCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseEvent = await CourseEvent.find().sort({ id: -1 });
      res.status(200).json({
        success: true,
        courseEvent,
      });
    } catch (error:any) {
      
      return next(new ErrorHandler(`error is ${error}`, 400));
    }
  }
);


// // delete the courseEvent
export const deleteCourseEvent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { id } = req.params;
      const courseEvent = await CourseEvent.findById(id).session(session);
      if (!courseEvent) {
        throw new ErrorHandler("courseevent not found", 400);
      }
      const updatedCourses = await Promise.all(
        courseEvent.filteredCourseId.map(async ({ courseId }) => {
          const courses = await CourseModel.findById(courseId).session(session);

          if (!courses) {
            throw new ErrorHandler(`Course with ID ${courseId} not found`, 400);
          }
          if (!courses.isEvent) {
            throw new ErrorHandler(`Course isevent with ID ${courseId} is not true`, 400);
          }

          const percentage = courseEvent.eventPercentage;
          const discountAmount = courses.discountPrice;
          const originalPrice = discountAmount / (1 - percentage / 100);

          return CourseModel.findByIdAndUpdate(
            courseId,
            { $set: { discountPrice: originalPrice, isEvent: false } },
            { new: true, session }
          );
        })
      );
      await courseEvent.deleteOne({ _id: id })

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        success: true,
        message: "Deleted events successfully",
        data: updatedCourses
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// export const deleteCourseEvent = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const courseEvent = await CourseEvent.findById(id);
//       if (!courseEvent) {
//         return next(new ErrorHandler("courseevent not found", 400));
//       }
//       const updatedCourses = await Promise.all(
//         courseEvent.filteredCourseId.map(async ({ courseId }) => {
//           const courses = await CourseModel.findById(courseId);

//           if (!courses) {
//             return next(
//               new ErrorHandler(`Course with ID ${courseId} not found `, 400)
//             );
//           }
//           if (!courses.isEvent) {
//             return next(
//               new ErrorHandler(
//                 `course isevent with ID ${courseId} is not true `,
//                 400
//               )
//             );
//           }

//           // calculate the discount price from percentage
//           const percentage = courseEvent.eventPercentage;
//           const discountAmount = courses.discountPrice;

//           const originalPrice = discountAmount / (1 - percentage / 100);
//           return CourseModel.findByIdAndUpdate(
//             courseId,
//             { $set: { discountPrice: originalPrice, isEvent: false } },
//             { new: true }
//           );
//         })
//       );
//       await courseEvent.deleteOne({ id });

//       res.status(200).json({
//         success: true,
//         message: "delet events  successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );





  //  hold on for next publish
// update the course Event
// export const updateCourseEvent = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const courseEventId = req.params.id;
//       const {
//         eventsType,
//         eventPercentage,
//         eventsName,
//         filteredCourseId,
//         startDate,
//         endDate,
//       } = req.body;
//       const  user = req.user
   
//       const existingCourseEvent = await CourseEvent.findById(courseEventId);
//       if (!existingCourseEvent) {
//         return next(new ErrorHandler("Course event id not found", 400));
//       }
//       const originalCourse = existingCourseEvent.filteredCourseId.map(
//         (course) => course.courseId
//       );

//        const updatedCourse = filteredCourseId.map(( course:any)=> course.courseId)
//       // Find courses that are no longer part of the event
//       // const coursesToRemove =  originalCourse.filter(
//       //   (course:any) => course
//       // );
             
//         // Find courses that are no longer part of the event
//         const coursesToRemove = originalCourse.filter(course => !updatedCourse.includes(course));
    
//       console.log( "filterCourse" ,updatedCourse)
//       console.log( "course to remove" ,coursesToRemove)
//       console.log("existingCourseEvent" , originalCourse)

//           //  update courses that is removed by upadating time 
//       //  const updatedCoursesToRemove = await Promise.all(
//       //   coursesToRemove.map(async ({ courseId }) => {
//       //     const course = await CourseModel.findById(courseId);

//       //     if (!course) {
//       //       throw new Error(`Course with ID ${courseId} not found`);
//       //     }
//       //     if (!course.isEvent) {
//       //       return next(new ErrorHandler(`course not found ${course}`, 400));
//       //     }

//       //     // calculate the discount price from percentage  that what was the real price before given offer and the we will update blew
//       //     const percentages = existingCourseEvent.eventPercentage;
//       //     const discountPrice = course.discountPrice;

//       //     const originalPrice = discountPrice / (1 - percentages / 100);

        
//       //     // Update the course with the new price and set isEvent to true
//       //     return CourseModel.findByIdAndUpdate(
//       //       courseId,
//       //       { $set: { discountPrice: originalPrice, isEvent: false } },
//       //       { new: true }
//       //     );
//       //   })
//       // );
//       // Find the CourseEvent by ID

//       const updatedCourses = await Promise.all(
//         existingCourseEvent.filteredCourseId.map(async ({ courseId }) => {
//           const course = await CourseModel.findById(courseId);

//           if (!course) {
//             throw new Error(`Course with ID ${courseId} not found`);
//           }
//           if (!course.isEvent) {
//             return next(new ErrorHandler(`course not found ${course}`, 400));
//           }

//           // calculate the discount price from percentage  that what was the real price before given offer and the we will update blew
//           const percentages = existingCourseEvent.eventPercentage;
//           const discountPrice = course.discountPrice;

//           const originalPrice = discountPrice / (1 - percentages / 100);

//           // Calculate the new price based on the discount percentage for updated percentage
//           const percentage = eventPercentage;
//           const discountAmount = originalPrice * (percentage / 100);
//           const newPrice = originalPrice - discountAmount;

//           // Update the course with the new price and set isEvent to true
//           return CourseModel.findByIdAndUpdate(
//             courseId,
//             { $set: { discountPrice: newPrice, isEvent: true } },
//             { new: true }
//           );
//         })
//       );

    
//       const updatedCourseEvent = await CourseEvent.findByIdAndUpdate(
//         courseEventId,
//         {
//           $set: {
//             eventsType,
//             eventPercentage,
//             eventsName,
//             filteredCourseId,
//             startDate,
//             endDate,
//             updatedBy:user?.name
//           },
//         },
//         { new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: "CourseEvent updated successfully",
//         updatedCourseEvent,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

