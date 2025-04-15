import express from 'express';
const adminRouter = express.Router();
import * as AdminController from '../controller/master.js';
import { uploadLogo } from '../common/upload_multer.js';
import { authenticateJWT } from "../middleware/authMiddleware.js";

adminRouter.get('/fetch',authenticateJWT, AdminController.fetchAdmin);
adminRouter.post('/update',authenticateJWT,uploadLogo,AdminController.updateAdmin);

export default adminRouter;