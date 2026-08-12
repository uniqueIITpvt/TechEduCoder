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
import contactRouter from './routes/contact.route';
import { RedisRateLimitStore } from './utils/rateLimitStore';
import { razorpayWebhook } from './controllers/order.controller';
// You can also use ESM `import * as Sentry from "@sentry/node"` instead of `require`
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://0180fab26d88770ecd9d96f9d3f6b802@o4507213780090880.ingest.de.sentry.io/4507214544175184",
  // Performance Monitoring
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"),
});


// cors => cross origin resource sharing
// app.use(
//   cors({
//     // origin: ['http://localhost:3000'],
//      origin: ["https://tech-edu-coder-client.vercel.app/"],
//      methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
//      credentials: true,
//   })
// );
const allowedOrigins = [
  'https://www.techeducoder.com',
  'https://techeducoderlms.vercel.app',
  'https://techeducoderlms-unique-iits-projects.vercel.app',
  'http://localhost:3000',
  ...(process.env.ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
  credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
  // Vercel and the supported reverse-proxy deployment use one trusted hop.
  app.set('trust proxy', 1);
}

// Razorpay signs the exact request bytes. Keep this route ahead of both the
// shared JSON parser and the general API limiter: it authenticates with its own
// HMAC signature and must remain available while Redis is recovering.
app.post(
  '/api/v1/payment/razorpay/webhook',
  express.raw({ type: 'application/json', limit: '1mb' }),
  razorpayWebhook
);

// api requests limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  store: new RedisRateLimitStore(),
});

app.use('/api/v1', limiter);

// Parse potentially large request bodies only after the request is admitted.
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

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
  courseEventRouter,
  contactRouter
 
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
// app.use(ErrorMiddleware);
app.use(Sentry.Handlers.errorHandler());
app.use(ErrorMiddleware);
