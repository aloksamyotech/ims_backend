import express from 'express';
const userRouter = express.Router();
import * as UserController from '../controller/user.js';
import { authenticateJWT } from '../middleware/authMiddleware.js'; 
import { uploadLogo } from '../common/upload_multer.js';

userRouter.post('/save',authenticateJWT, UserController.create);
userRouter.get('/fetch',authenticateJWT, UserController.fetchUser);
userRouter.get('/fetchById/:id',authenticateJWT, UserController.fetchById_User);
userRouter.post('/login', UserController.loginUser);
userRouter.patch('/update/:id',authenticateJWT,UserController.updateUser);
userRouter.delete("/deleteById/:id", authenticateJWT,UserController.deleteUser);
userRouter.put("/change-password", authenticateJWT, UserController.changePassword);
userRouter.patch('/change-status/:id',authenticateJWT,UserController.changeCompanyStatus);
userRouter.get("/count",authenticateJWT, UserController.getCompanyCount);
userRouter.get("/report",authenticateJWT, UserController.getCompanyCount);
userRouter.post("/ai/report",authenticateJWT, UserController.getAiReportData);
userRouter.put('/currency-logo/:id',authenticateJWT,uploadLogo,UserController.updateCurrencyLogo);

export default userRouter;
