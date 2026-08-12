require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import userModel, { IUser } from '../models/user.model';
import ErrorHandler from '../utils/ErrorHandler';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendMail from '../utils/sendMail';
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from '../utils/jwt';
import { redis } from '../utils/redis';
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from '../services/user.service';
import cloudinary from 'cloudinary';
import { sanitizeUser } from '../utils/sanitizeUser';

const forwardUserError = (error: any, next: NextFunction) =>
  next(
    error?.statusCode
      ? error
      : new ErrorHandler(
          error?.message || 'Internal server error',
          error?.name === 'RedisUnavailableError' ? 503 : 500
        )
  );

// register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body as IRegistrationBody;
      const normalizedName = typeof name === 'string' ? name.trim() : '';
      const normalizedEmail = typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';

      if (!normalizedName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return next(new ErrorHandler('Please enter a valid name and email', 400));
      }
      if (typeof password !== 'string' || password.length < 6) {
        return next(new ErrorHandler('Password must be at least 6 characters', 400));
      }

      const isEmailExist = await userModel.findOne({ email: normalizedEmail });
      if (isEmailExist) {
        return next(new ErrorHandler('Email already exist', 400));
      }

      const user: IRegistrationBody = {
        name: normalizedName,
        email: normalizedEmail,
        password,
      };

      const activationCode = crypto.randomInt(1000, 10000).toString();
      const activationToken = crypto.randomBytes(32).toString('hex');
      const pendingKey = `pending-registration:${activationToken}`;
      await redis.set(
        pendingKey,
        JSON.stringify({ user, activationCode, attempts: 0 }),
        'EX',
        300
      );

      const data = { user: { name: user.name }, activationCode };

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          activationToken,
        });
      } catch (error: any) {
        await redis.del(pendingKey);
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      if (!/^[a-f0-9]{64}$/.test(activation_token || '')) {
        return next(new ErrorHandler('Invalid or expired activation token', 400));
      }

      const pendingKey = `pending-registration:${activation_token}`;
      const pendingJson = await redis.get(pendingKey);
      if (!pendingJson) {
        return next(new ErrorHandler('Invalid or expired activation token', 400));
      }

      const pending = JSON.parse(pendingJson) as {
        user: IRegistrationBody;
        activationCode: string;
        attempts: number;
      };

      if (pending.activationCode !== String(activation_code)) {
        const attempts = (pending.attempts || 0) + 1;
        if (attempts >= 5) {
          await redis.del(pendingKey);
        } else {
          await redis.set(
            pendingKey,
            JSON.stringify({ ...pending, attempts }),
            'EX',
            300
          );
        }
        return next(new ErrorHandler('Invalid activation code', 400));
      }

      const { name, email, password } = pending.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler('Email already exist', 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true,
      });
      await redis.del(pendingKey);

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
      }

      const normalizedEmail = typeof email === 'string'
        ? email.trim().toLowerCase()
        : '';
      const user = await userModel
        .findOne({ email: normalizedEmail })
        .select('+password');

      if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid email or password', 400));
      }

      await sendToken(user, 200, res);
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      const userId = req.user?._id || '';
      await redis.del(userId);
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// update access token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const refreshTokenSecret = process.env.REFRESH_TOKEN;
      const accessTokenSecret = process.env.ACCESS_TOKEN;
      if (!refresh_token) {
        return next(new ErrorHandler('Please login to access this resource', 401));
      }
      if (!refreshTokenSecret || !accessTokenSecret) {
        return next(new ErrorHandler('Authentication is not configured', 500));
      }
      const decoded = jwt.verify(
        refresh_token,
        refreshTokenSecret
      ) as JwtPayload;

      const message = 'Could not refresh token';
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler('Please login to access this resource', 401)
        );
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        accessTokenSecret,
        {
          expiresIn: '5m',
        }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        refreshTokenSecret,
        {
          expiresIn: '3d',
        }
      );

      const safeUser = sanitizeUser(user);
      req.user = safeUser as IUser;

      res.cookie('access_token', accessToken, accessTokenOptions);
      res.cookie('refresh_token', refreshToken, refreshTokenOptions);

      await redis.set(user._id, JSON.stringify(safeUser), 'EX', 604800); // 7days

      return next();
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      await getUserById(userId, res);
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// update user info
interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;

      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      const safeUser = sanitizeUser(user);
      await redis.set(userId, JSON.stringify(safeUser), 'EX', 604800);

      res.status(201).json({
        success: true,
        user: safeUser,
      });
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('Please enter old and new password', 400));
      }

      const user = await userModel.findById(req.user?._id).select('+password');

      if (user?.password === undefined) {
        return next(new ErrorHandler('Invalid user', 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid old password', 400));
      }

      user.password = newPassword;

      await user.save();

      const safeUser = sanitizeUser(user);
      await redis.set(
        req.user?._id,
        JSON.stringify(safeUser),
        'EX',
        604800
      );

      res.status(201).json({
        success: true,
        user: safeUser,
      });
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

interface IUpdateProfilePicture {
  avatar: string;
}

// update profile picture
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        // if user have one avatar then call this if
        if (user?.avatar?.public_id) {
          // first delete the old image
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();

      const safeUser = sanitizeUser(user);
      await redis.set(userId, JSON.stringify(safeUser), 'EX', 604800);

      res.status(200).json({
        success: true,
        user: safeUser,
      });
    } catch (error: any) {
      return forwardUserError(error, next);
    }
  }
);

// get all users --- only for admin
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      const isUserExist = await userModel.findOne({ email });
      if (isUserExist) {
        const id = isUserExist._id;
        await updateUserRoleService(res, id, role);
      } else {
        res.status(400).json({
          success: false,
          message: 'User not found',
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete user --- only for admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      await user.deleteOne({ id });

      await redis.del(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
