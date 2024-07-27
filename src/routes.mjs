import express from 'express';
import asyncHandler from 'express-async-handler';
import { getProfile } from './middleware/getProfile.mjs';
import { makeDeposit } from './controller/balanceController.mjs';
import { getAllContracts, getContractById } from './controller/contractController.mjs';

const routes = express.Router();

routes.get('/contracts', getProfile, asyncHandler(getAllContracts));
routes.get('/contracts/:id', getProfile, asyncHandler(getContractById));
routes.post('/balances/deposit/:userId', getProfile, asyncHandler(makeDeposit));

export default routes;
