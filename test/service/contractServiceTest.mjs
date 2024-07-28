import { expect } from 'chai';
import esmock from 'esmock';

describe('Contract Service', () => {
  describe('getContract', () => {
    it('should return a contract when found', async () => {
      const mockContract = { id: 1, status: 'in_progress' };
      const { getContract } = await esmock(
        '../../src/service/contractService.mjs', {
          '../../src/repository/contractRepository.mjs': {
            findOneByIdAndProfileId: async () => mockContract,
          },
        });

      const contractId = 1;
      const profileId = 5;
      const result = await getContract(contractId, profileId);

      expect(result).to.deep.equal(mockContract);
    });

    it('should return null when contract not found', async () => {
      const { getContract } = await esmock(
        '../../src/service/contractService.mjs', {
          '../../src/repository/contractRepository.mjs': {
            findOneByIdAndProfileId: async () => null,
          },
        });

      const contractId = 1;
      const profileId = 999;
      const result = await getContract(contractId, profileId);

      expect(result).to.be.null;
    });
  });

  describe('getContracts', () => {
    it('should return all non-terminated contracts for a profile', async () => {
      const mockContracts = [ { id: 1 }, { id: 2 } ];
      const { getContracts } = await esmock(
        '../../src/service/contractService.mjs', {
          '../../src/repository/contractRepository.mjs': {
            findByProfileIdAndTerminatedFalse: async () => mockContracts,
          },
        });

      const profileId = 1;
      const result = await getContracts(profileId);

      expect(result).to.deep.equal(mockContracts);
    });

    it('should return an empty array when no contracts found', async () => {
      const { getContracts } = await esmock(
        '../../src/service/contractService.mjs', {
          '../../src/repository/contractRepository.mjs': {
            findByProfileIdAndTerminatedFalse: async () => [],
          },
        });

      const profileId = 5;
      const result = await getContracts(profileId);

      expect(result).to.be.an('array').that.is.empty;
    });
  });
});
