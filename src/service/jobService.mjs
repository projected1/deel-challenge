import {
  findByProfileIdAndInProgressTrue,
} from '../repository/jobRepository.mjs';

async function findUnpaidJobs(profileId) {
  const jobs = await findByProfileIdAndInProgressTrue(profileId);
  return jobs;
}

export {
  findUnpaidJobs,
};
