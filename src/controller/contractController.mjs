import { HttpCode } from '../config/constants.mjs';
import { getContract } from '../service/contractService.mjs';

async function getContractById(req, res) {
  const { id: contractId } = req.params;
  const { id: profileId } = req.profile;

  const contract = await getContract(contractId, profileId);
  return !contract
    ? res.status(HttpCode.HTTP_404).end()
    : res.status(HttpCode.HTTP_200).json(contract);
}

export {
  getContractById,
};
