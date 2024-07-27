import {
  findTopEarningProfessionByDateRange,
} from '../repository/adminRepository.mjs';

async function findBestProfession(startDate, endDate) {
  const profession =
    await findTopEarningProfessionByDateRange(startDate, endDate);
  return profession;
}

export { findBestProfession };
