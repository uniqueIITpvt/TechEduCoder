import express from "express";

import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  adminGetCourseEvent,
  createCourseEvent,
  deleteCourseEvent,
  updateCourseEvent,
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

courseEventRouter.delete(
  "/deleteCourseEvent/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourseEvent
);

courseEventRouter.put(
  "/updateCourseEvent/:id",
  isAutheticated,
  authorizeRoles("admin"),
  updateCourseEvent
);
export default courseEventRouter;
