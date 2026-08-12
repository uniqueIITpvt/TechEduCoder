import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { app } from "../app";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

let dbConnection: Promise<typeof mongoose> | null = null;

async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    return;
  }

  dbConnection =
    dbConnection ||
    mongoose.connect(dbUrl).then((connection) => {
      console.log(`Database connected with ${connection.connection.host}`);
      return connection;
    });

  await dbConnection;
}

export default async function handler(req: any, res: any) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error: any) {
    console.error(error?.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
