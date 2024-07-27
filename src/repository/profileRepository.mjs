import Job from '../model/jobModel.mjs';
import Profile from '../model/profileModel.mjs';
import Contract from '../model/contractModel.mjs';
import { ProfileTypes } from '../config/enums.mjs';

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
  const profile = await Profile.findOne({
    where: {
      type: ProfileTypes.CLIENT,
    },
    include: {
      model: Contract,
      as: 'Client',
      include: {
        model: Job,
        where: {
          id: jobId,
        },
      },
    },
  });
  return profile;
}

export {
  save,
  findOne,
  findOneByJobIdAndTypeClient,
};
