import { HttpCode } from '../config/constants.mjs';
import { getContract, getContracts } from '../service/contractService.mjs';

async function getContractById(req, res) {
  const { id: contractId } = req.params;
  const { id: profileId } = req.profile;

  const contract = await getContract(contractId, profileId);
  return !contract
    ? res.status(HttpCode.HTTP_404).end()
    : res.status(HttpCode.HTTP_200).json(contract);
}

async function getAllContracts(req, res) {
  const { id: profileId } = req.profile;

  const contracts = await getContracts(profileId);
  return res.status(HttpCode.HTTP_200).json(contracts);
}

export {
  getContractById,
  getAllContracts,
};
