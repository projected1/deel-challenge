import { findOneByIdAndProfileId } from '../repository/contractRepository.mjs';

async function getContract(contractId, profileId) {
  const contract = await findOneByIdAndProfileId(contractId, profileId);
  return contract;
}

export {
  getContract,
};
