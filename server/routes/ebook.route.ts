import express from "express";
import {
  createEbook,
  deleteEbook,
  editEbook,
  getAdminAllEbooks,
  getAllEbooks,
  getEbookDetails,
  getEbookContent,
  // add other eBook related controller functions here if you have any
} from "../controllers/ebook.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";

const ebookRouter = express.Router();

// Route to create a new eBook
ebookRouter.post("/create-ebook", isAutheticated , authorizeRoles("admin"),createEbook);

// Route to get all eBooks
ebookRouter.get("/all-ebooks", getAllEbooks);

// Route to get details of a specific eBook by ID
ebookRouter.get("/ebook-details/:id", getEbookDetails);
ebookRouter.get("/ebook-content/:id", isAutheticated, getEbookContent);
ebookRouter.put(
  "/edit-ebook/:id",
  isAutheticated,
  authorizeRoles("admin"),
  editEbook
);
ebookRouter.delete(
  "/delete-Ebook/:id",
  isAutheticated,
  authorizeRoles("admin"),
  deleteEbook
);
ebookRouter.get(
  "/get-allEbooks",
  isAutheticated,
  authorizeRoles("admin"),
  getAdminAllEbooks
);


export default ebookRouter;
