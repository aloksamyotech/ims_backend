import express from 'express';
const userRouter = express.Router();
import * as UserController from '../controller/user.js';
import { authenticateJWT } from '../middleware/authMiddleware.js'; 

userRouter.post('/save', UserController.create);
userRouter.get('/fetch', UserController.fetchUser);
userRouter.get('/fetchById/:id', UserController.fetchById_User);
userRouter.post('/login', UserController.loginUser);
userRouter.patch('/update/:id',UserController.updateUser);
userRouter.delete("/deleteById/:id", UserController.deleteUser);
userRouter.put("/change-password", authenticateJWT, UserController.changePassword);
userRouter.patch('/change-status/:id',UserController.changeCompanyStatus);
userRouter.get("/count", UserController.getCompanyCount);

export default userRouter;
