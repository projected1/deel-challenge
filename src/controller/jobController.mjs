import DeelError from '../error/deelError.mjs';
import UnauthorizedError from '../error/unauthorizedError.mjs';
import { HttpCode } from '../config/constants.mjs';
import { ProfileTypes } from '../config/enums.mjs';
import { findClientProfile } from '../service/profileService.mjs';
import {
  findUnpaidJobs,
  createJobPayment,
} from '../service/jobService.mjs';

async function getUnpaidJobs(req, res) {
  const { id: profileId } = req.profile;

  const jobs = await findUnpaidJobs(profileId);
  return res.status(HttpCode.HTTP_200).json(jobs);
}

async function makeJobPayment(req, res) {
  const { job_id: jobId } = req.params;
  const { id: profileId, type: profileType } = req.profile;

  const { id: clientId } = await findClientProfile(jobId);

  const isAuthorized =
    profileType === ProfileTypes.CLIENT &&
    profileId === clientId;
  if (!isAuthorized) {
    throw new UnauthorizedError('Invalid job client');
  }

  try {
    const result = await createJobPayment(jobId);
    return res.status(HttpCode.HTTP_201).json(result);

  } catch (err) {
    console.error('Failed to make job payment: %s', err.message);

    if (err instanceof DeelError) {
      return res.status(err.code).end();
    }

    throw err;
  }
}

export {
  getUnpaidJobs,
  makeJobPayment,
};
