import Job from '../model/jobModel.mjs';
import Profile from '../model/profileModel.mjs';
import Contract from '../model/contractModel.mjs';

async function save(profile, transaction) {
  const res = await profile.save({ transaction });
  return res;
}

async function findOne(profileId, transaction) {
  const profile = await Profile.findOne({
    where: {
      id: profileId || 0,
    },
    transaction,
  });
  return profile;
}

async function findOneByJobIdAndTypeClient(jobId) {
  const job = await Job.findOne({
    where: { id: jobId },
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Client',
      },
    },
  });
  const profile = job?.Contract?.Client ?? null;
  return profile;
}

export {
  save,
  findOne,
  findOneByJobIdAndTypeClient,
};
