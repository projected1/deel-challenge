import { HttpCode } from '../config/constants.mjs';
import { findBestProfession, findBestClients } from '../service/adminService.mjs';

async function getBestProfession(req, res) {
  const { start: stardDate, end: endDate } = req.query;
  const profession = await findBestProfession(stardDate, endDate);
  return res.status(HttpCode.HTTP_200).json(profession);
}

async function getBestClients(req, res) {
  const { start: stardDate, end: endDate } = req.query;
  const limit = req.query.limit;
  const profession = await findBestClients(stardDate, endDate, limit);
  return res.status(HttpCode.HTTP_200).json(profession);
}

export {
  getBestClients,
  getBestProfession,
};
