import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { updateAccessToken } from "../controllers/user.controller";
import userModel from "../models/user.model";
import { sanitizeUser } from "../utils/sanitizeUser";

// authenticated user
export const isAutheticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    let decoded: JwtPayload;
    const accessTokenSecret = process.env.ACCESS_TOKEN;
    if (!accessTokenSecret) {
      return next(new ErrorHandler("ACCESS_TOKEN is not configured", 500));
    }

    try {
      decoded = jwt.verify(access_token, accessTokenSecret) as JwtPayload;
    } catch (error: any) {
      if (error?.name !== "TokenExpiredError") {
        return next(new ErrorHandler("access token is not valid", 401));
      }

      decoded = jwt.decode(access_token) as JwtPayload;
    }

    if (!decoded?.id) {
      return next(new ErrorHandler("access token is not valid", 401));
    }

    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
        await updateAccessToken(req, res, next);
      } catch (error) {
        return next(error);
      }
    } else {
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      req.user = sanitizeUser(user);

      next();
    }
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
