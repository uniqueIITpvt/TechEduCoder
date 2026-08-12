import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";
import { sanitizeUser } from "../utils/sanitizeUser";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = sanitizeUser(JSON.parse(userJson));
    res.status(201).json({
      success: true,
      user,
    });
    return;
  }

  const user = await userModel.findById(id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  const safeUser = sanitizeUser(user);
  await redis.set(id, JSON.stringify(safeUser), "EX", 604800);
  res.status(200).json({
    success: true,
    user: safeUser,
  });
};

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (res:Response,id: string,role:string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  if (user) {
    await redis.del(id);
  }

  res.status(201).json({
    success: true,
    user,
  });
}
