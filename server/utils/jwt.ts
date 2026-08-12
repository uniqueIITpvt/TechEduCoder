require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import { sanitizeUser } from "./sanitizeUser";

interface ITokenOptions {
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Access-token lifetime is expressed in minutes; refresh-token lifetime in days.
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "5",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "3",
  10
);

const isProduction = process.env.NODE_ENV === "production";
const sameSite = isProduction ? "none" : "lax";

// options for cookies
export const accessTokenOptions: ITokenOptions = {
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite,
  secure: isProduction,
};

export const refreshTokenOptions: ITokenOptions = {
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite,
  secure: isProduction,
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();
  const safeUser = sanitizeUser(user);

  // upload session to redis
  await redis.set(user._id, JSON.stringify(safeUser), "EX", 604800);

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user: safeUser,
  });
};
