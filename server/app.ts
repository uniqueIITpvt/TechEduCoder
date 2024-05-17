require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import analyticsRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';
import { rateLimit } from 'express-rate-limit';
import blogsRouter from './routes/blogs.route';
import ebookRouter from './routes/ebook.route';
import courseEventRouter from './routes/courseEvents.route';
// You can also use ESM `import * as Sentry from "@sentry/node"` instead of `require`
const Sentry = require("@sentry/node");
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://0180fab26d88770ecd9d96f9d3f6b802@o4507213780090880.ingest.de.sentry.io/4507214544175184",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});


// body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
// app.use(
//   cors({
//     // origin: ['http://localhost:3000'],
//      origin: ["https://tech-edu-coder-client.vercel.app/"],
//      methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
//      credentials: true,
//   })
// );
app.use(cors({
  origin: ["https://www.techeducoder.com" ,"http://localhost:3000"],
  methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
  credentials: true,
}));


// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// routes
app.use(
  '/api/v1',
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter,
  blogsRouter,
  ebookRouter,
  courseEventRouter
 
);

// testing api
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    succcess: true,
    message: 'API is working',
  });
});


app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// middleware calls
app.use(limiter);
// app.use(ErrorMiddleware);
app.use(Sentry.Handlers.errorHandler());
app.use(ErrorMiddleware);
