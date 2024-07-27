import { Op } from 'sequelize';
import Job from '../model/jobModel.mjs';
import Profile from '../model/profileModel.mjs';
import Contract from '../model/contractModel.mjs';
import { ContractStatuses } from '../config/enums.mjs';

async function save(job, transaction) {
  const res = await job.save({ transaction });
  return res;
}

async function findOne(jobId, transaction) {
  const job = Job.findOne({
    where: {
      id: jobId,
    },
    include: {
      model: Contract,
      include: [
        { model: Profile, as: 'Client' },
        { model: Profile, as: 'Contractor' },
      ],
    },
    transaction,
  });
  return job;
}

async function findByProfileIdAndInProgressTrue(profileId) {
  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true,
      },
    },
    include: {
      model: Contract,
      where: {
        status: {
          [Op.not]: ContractStatuses.TERMINATED,
        },
        [Op.or]: [
          { ClientId: profileId },
          { ContractorId: profileId },
        ],
      },
      required: true,
      attributes: [],
    },
  });
  return jobs;
}

export {
  save,
  findOne,
  findByProfileIdAndInProgressTrue,
};
