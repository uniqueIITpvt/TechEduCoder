import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogDetails,
  editBlog, 
  deleteBlog,
  getAdminAllBlogs
} from '../controllers/blogs.controller';
import { authorizeRoles, isAutheticated } from '../middleware/auth';


const blogsRouter = express.Router();
blogsRouter.post('/create-blog',  isAutheticated , authorizeRoles("admin"), createBlog);

blogsRouter.get('/all-blogs', getAllBlogs);

blogsRouter.get('/blog-details/:id', getBlogDetails);

blogsRouter.put('/update-blog/:id'  ,editBlog);

blogsRouter.delete('/delete-blog/:id', isAutheticated , authorizeRoles("admin") ,deleteBlog);
blogsRouter.get("/all-admin-blogs" , isAutheticated, authorizeRoles("admin"), getAdminAllBlogs )

export default blogsRouter;
 