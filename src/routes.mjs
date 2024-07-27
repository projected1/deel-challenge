import express from 'express';
import asyncHandler from 'express-async-handler';
import { getProfile } from './middleware/getProfile.mjs';
import { getContractById } from './controller/contractController.mjs';

const routes = express.Router();

routes.get('/contracts/:id', getProfile, asyncHandler(getContractById));

export default routes;
