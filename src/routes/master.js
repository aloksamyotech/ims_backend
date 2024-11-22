import express from 'express';
const adminRouter = express.Router();
import * as AdminController from '../controller/master.js';

adminRouter.get('/fetch', AdminController.fetchAdmin);
adminRouter.patch('/update/:id',AdminController.updateAdmin);

export default adminRouter;