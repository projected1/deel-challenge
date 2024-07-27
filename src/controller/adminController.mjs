import { HttpCode } from '../config/constants.mjs';
import { findBestProfession } from '../service/adminService.mjs';

async function getBestProfession(req, res) {
  const { start: stardDate, end: endDate } = req.query;
  const profession = await findBestProfession(stardDate, endDate);
  return res.status(HttpCode.HTTP_200).json(profession);
}

export {
  getBestProfession,
};
