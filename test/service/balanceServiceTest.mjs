import { expect } from 'chai';
import esmock from 'esmock';

describe('Balance Service', () => {
  describe('saveDeposit', () => {
    it('should successfully save a deposit when amount is within limit', async () => {
      const mockTransaction = {
        commit: async () => {},
        rollback: async () => {},
      };
      const mockSequelize = {
        transaction: async () => mockTransaction,
      };
      const { saveDeposit } = await esmock(
        '../../src/service/balanceService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/balanceRepository.mjs': {
            sumPriceByContractStatusInProgress: async () => 400,
            incrementBalanceByAmount: async () => 150,
          },
        });

      const result = await saveDeposit(1, 100);

      expect(result).to.deep.equal({ profileId: 1, balance: 150 });
    });

    it('should throw InvalidInputError when deposit amount exceeds limit', async () => {
      const mockTransaction = {
        commit: async () => {},
        rollback: async () => {},
      };
      const mockSequelize = {
        transaction: async () => mockTransaction,
      };
      const { saveDeposit } = await esmock(
        '../../src/service/balanceService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/balanceRepository.mjs': {
            sumPriceByContractStatusInProgress: async () => 400,
          },
          '../../src/error/invalidInputError.mjs': class InvalidInputError extends Error {},
        });

      try {
        await saveDeposit(1, 101);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Max deposit amount is 100');
      }
    });

    it('should rollback transaction on error', async () => {
      let rolledBack = false;
      const mockTransaction = {
        commit: async () => {},
        rollback: async () => rolledBack = true,
      };
      const mockSequelize = {
        transaction: async () => mockTransaction,
      };
      const { saveDeposit } = await esmock(
        '../../src/service/balanceService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/balanceRepository.mjs': {
            sumPriceByContractStatusInProgress: async () => 400,
            incrementBalanceByAmount: async () => {
              throw new Error('Database error');
            },
          },
        });

      try {
        await saveDeposit(1, 100);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Database error');
        expect(rolledBack).to.be.true;
      }
    });
  });
});
