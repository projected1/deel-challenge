import {
  findOneByIdAndProfileId,
  findByProfileIdAndTerminatedFalse,
} from '../repository/contractRepository.mjs';

async function getContract(contractId, profileId) {
  const contract = await findOneByIdAndProfileId(contractId, profileId);
  return contract;
}

async function getContracts(profileId) {
  const contracts = await findByProfileIdAndTerminatedFalse(profileId);
  return contracts;
}

export {
  getContract,
  getContracts,
};
