import express from 'express';
const adminRouter = express.Router();
import * as AdminController from '../controller/master.js';
import { uploadLogo } from '../common/upload_multer.js';

adminRouter.get('/fetch', AdminController.fetchAdmin);
adminRouter.post('/update',uploadLogo,AdminController.updateAdmin);

export default adminRouter;