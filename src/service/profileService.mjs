import {
  findOneByJobIdAndTypeClient,
} from '../repository/profileRepository.mjs';

async function findClientProfile(jobId) {
  const profile = await findOneByJobIdAndTypeClient(jobId);
  return profile;
}

export {
  findClientProfile,
};
