import express from 'express';
const adminRouter = express.Router();
import * as AdminController from '../controller/master.js';

adminRouter.get('/fetch', AdminController.fetchAdmin);

export default adminRouter;