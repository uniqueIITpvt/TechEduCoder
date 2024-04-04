"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogs_controller_1 = require("../controllers/blogs.controller");
const auth_1 = require("../middleware/auth");
const blogsRouter = express_1.default.Router();
blogsRouter.post('/create-blog', auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blogs_controller_1.createBlog);
blogsRouter.get('/all-blogs', blogs_controller_1.getAllBlogs);
blogsRouter.get('/blog-details/:id', blogs_controller_1.getBlogDetails);
blogsRouter.put('/update-blog/:id', blogs_controller_1.editBlog);
blogsRouter.delete('/delete-blog/:id', auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blogs_controller_1.deleteBlog);
blogsRouter.get("/all-admin-blogs", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blogs_controller_1.getAdminAllBlogs);
exports.default = blogsRouter;
