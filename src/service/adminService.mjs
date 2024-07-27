import {
  findTopPayingClientsInDateRange,
  findTopEarningProfessionByDateRange,
} from '../repository/adminRepository.mjs';

async function findBestProfession(startDate, endDate) {
  const profession =
    await findTopEarningProfessionByDateRange(startDate, endDate);
  return profession;
}

async function findBestClients(startDate, endDate, limit = 2) {
  const clients =
    await findTopPayingClientsInDateRange(startDate, endDate, limit);
  return clients;
}

export {
  findBestClients,
  findBestProfession,
};
