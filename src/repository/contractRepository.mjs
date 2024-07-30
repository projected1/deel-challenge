import { Op } from 'sequelize';
import Contract from '../model/contractModel.mjs';
import { ContractStatuses } from '../config/enums.mjs';

async function findOneByIdAndProfileId(contractId, profileId) {
  const contract = await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [
        { ClientId: profileId },
        { ContractorId: profileId },
      ],
    },
  });
  return contract;
}

async function findByProfileIdAndTerminatedFalse(profileId) {
  const contracts = Contract.findAll({
    where: {
      status: {
        [Op.ne]: ContractStatuses.TERMINATED,
      },
      [Op.or]: [
        { ClientId: profileId },
        { ContractorId: profileId },
      ],
    },
  });
  return contracts;
}

export {
  findOneByIdAndProfileId,
  findByProfileIdAndTerminatedFalse,
};
