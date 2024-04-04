"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ebook_controller_1 = require("../controllers/ebook.controller");
const auth_1 = require("../middleware/auth");
const ebookRouter = express_1.default.Router();
// Route to create a new eBook
ebookRouter.post("/create-ebook", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), ebook_controller_1.createEbook);
// Route to get all eBooks
ebookRouter.get("/all-ebooks", ebook_controller_1.getAllEbooks);
// Route to get details of a specific eBook by ID
ebookRouter.get("/ebook-details/:id", ebook_controller_1.getEbookDetails);
ebookRouter.put("/edit-ebook/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), ebook_controller_1.editEbook);
ebookRouter.delete("/delete-Ebook/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), ebook_controller_1.deleteEbook);
ebookRouter.get("/get-allEbooks", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), ebook_controller_1.getAdminAllEbooks);
exports.default = ebookRouter;
