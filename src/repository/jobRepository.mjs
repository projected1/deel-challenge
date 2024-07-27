import { Op } from 'sequelize';
import Job from '../model/jobModel.mjs';
import Contract from '../model/contractModel.mjs';
import { ContractStatuses } from '../config/enums.mjs';

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
  findByProfileIdAndInProgressTrue,
};
