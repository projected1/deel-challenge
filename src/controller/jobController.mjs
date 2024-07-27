import { HttpCode } from '../config/constants.mjs';
import { findUnpaidJobs } from '../service/jobService.mjs';

async function getUnpaidJobs(req, res) {
  const { id: profileId } = req.profile;

  const jobs = await findUnpaidJobs(profileId);
  return res.status(HttpCode.HTTP_200).json(jobs);
}

export {
  getUnpaidJobs,
};
