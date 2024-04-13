import express from "express";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  UserGetCourseEvent,
  adminGetCourseEvent,
  createCourseEvent,
  deleteCourseEvent,
} from "../controllers/courseEvent.controller";
const courseEventRouter = express.Router();

courseEventRouter.post(
  "/create-course-event",
  isAutheticated,
  authorizeRoles("admin"),
  createCourseEvent
);
courseEventRouter.get(
  "/adminGetCourseEvent",
  isAutheticated,
  authorizeRoles("admin"),
  adminGetCourseEvent
);
courseEventRouter.get("/UserGetCourseEvent",
 UserGetCourseEvent);

courseEventRouter.delete(
  "/deleteCourseEvent/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourseEvent
);

// courseEventRouter.put(
//   "/updateCourseEvent/:id",
//   isAutheticated,
//   authorizeRoles("admin"),

// );
export default courseEventRouter;
