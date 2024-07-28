import { expect } from 'chai';
import esmock from 'esmock';

describe('Balance Repository', () => {
  describe('sumPriceByContractStatusInProgress', () => {
    it('should sum job prices for in-progress contracts', async () => {
      const mockSum = 500;
      const mockSumFunction = async (field, options) => {
        expect(field).to.equal('price');
        expect(options.include.model.name).to.equal('Contract');
        expect(options.include.where.ClientId).to.equal(1);
        expect(options.include.where.status).to.equal('in_progress');
        return mockSum;
      };

      const { sumPriceByContractStatusInProgress } = await esmock(
        '../../src/repository/balanceRepository.mjs', {
          '../../src/model/jobModel.mjs': { sum: mockSumFunction },
          '../../src/config/enums.mjs': { ContractStatuses: { IN_PROGRESS: 'in_progress' } },
        });

      const result = await sumPriceByContractStatusInProgress(1);
      expect(result).to.equal(mockSum);
    });

    it('should return null if no in-progress contracts found', async () => {
      const mockSumFunction = async () => null;

      const { sumPriceByContractStatusInProgress } = await esmock(
        '../../src/repository/balanceRepository.mjs', {
          '../../src/model/jobModel.mjs': { sum: mockSumFunction },
          '../../src/config/enums.mjs': { ContractStatuses: { IN_PROGRESS: 'in_progress' } },
        });

      const result = await sumPriceByContractStatusInProgress(999);
      expect(result).to.be.null;
    });
  });

  describe('incrementBalanceByAmount', () => {
    it('should increment balance and return new balance', async () => {
      const mockIncrement = async () => {};
      const mockFindOne = async () => ({ balance: 600 });

      const { incrementBalanceByAmount } = await esmock(
        '../../src/repository/balanceRepository.mjs', {
          '../../src/model/profileModel.mjs': {
            increment: mockIncrement,
            findOne: mockFindOne,
          },
        });

      const result = await incrementBalanceByAmount(1, 100);
      expect(result).to.equal(600);
    });
  });
});
