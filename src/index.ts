import { connectToDatabase } from './db/db';
import express, { Request, Response, NextFunction } from 'express';
import {
  deleteUsers,
  getUsers,
  login,
  register,
  updateUsers,
} from './controller/usercontroller';
import {
  createBlogs,
  updateBlogs,
  getAllBlogs,
  deleteBlogs,
  getAllBlogsByUserId,
} from './controller/blogcontroller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const PORT = 4000;
declare module 'express' {
  interface Request {
    user?: any;
  }
}
function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized - Token not provided' });
  }
  const secretKey = process.env.SECRETKEY || '';
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// users routes
app.post('/login', login);
app.post('/register', register);
app.get('/getusers', getUsers);
app.put('/updateusers/:id', updateUsers);
app.delete('/deleteusers/:id', deleteUsers);

// blog routes
app.post('/createblogs',verifyToken, createBlogs);
app.put('/updateblogs/:id',verifyToken, updateBlogs);
app.delete('/deleteblogs/:id',verifyToken, deleteBlogs);
app.get('/getblogs', getAllBlogs);
app.get('/getuserblogs',verifyToken,getAllBlogsByUserId)

function startServer() {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

connectToDatabase(startServer);
