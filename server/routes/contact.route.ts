import express from "express";
import { createContactMessage } from "../controllers/contact.controller";

const contactRouter = express.Router();

contactRouter.post("/create-message", createContactMessage);

export default contactRouter;
