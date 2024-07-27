import { Op } from 'sequelize';
import Contract from '../model/contractModel.mjs';

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

export {
  findOneByIdAndProfileId,
};
