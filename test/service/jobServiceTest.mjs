import { expect } from 'chai';
import esmock from 'esmock';

describe('Job Service', () => {
  describe('findUnpaidJobs', () => {
    it('should return unpaid jobs for a profile', async () => {
      const mockJobs = [ { id: 1, paid: false }, { id: 2, paid: false } ];
      const { findUnpaidJobs } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/repository/jobRepository.mjs': {
            findByProfileIdAndInProgressTrue: async () => mockJobs,
          },
        });

      const result = await findUnpaidJobs(1);

      expect(result).to.deep.equal(mockJobs);
    });
  });

  describe('createJobPayment', () => {
    const mockTransaction = {
      commit: async () => {},
      rollback: async () => {},
    };
    const mockSequelize = {
      transaction: async () => mockTransaction,
    };

    it('should successfully process a job payment', async () => {
      const mockJob = {
        id: 1,
        paid: false,
        price: 100,
        Contract: { ClientId: 1, ContractorId: 2 },
      };
      const mockClient = { id: 1, balance: 200 };
      const mockContractor = { id: 2, balance: 50 };

      const { createJobPayment } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/jobRepository.mjs': {
            findOne: async () => mockJob,
            save: async job => job,
          },
          '../../src/repository/profileRepository.mjs': {
            findOne: async id => id === 1 ? mockClient : mockContractor,
            save: async profile => profile,
          },
        });

      const result = await createJobPayment(1);

      expect(result).to.deep.equal({ profileId: 1, balance: 100 });
    });

    it('should throw NotFoundError when job is not found', async () => {
      const { createJobPayment } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/jobRepository.mjs': {
            findOne: async () => null,
          },
          '../../src/error/notFoundError.mjs': class NotFoundError extends Error {},
        });

      try {
        await createJobPayment(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Job not found');
      }
    });

    it('should throw InvalidInputError when job is already paid', async () => {
      const mockJob = { id: 1, paid: true };
      const { createJobPayment } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/jobRepository.mjs': {
            findOne: async () => mockJob,
          },
          '../../src/error/invalidInputError.mjs': class InvalidInputError extends Error {},
        });

      try {
        await createJobPayment(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Job already paid');
      }
    });

    it('should throw InvalidInputError when client has insufficient balance', async () => {
      const mockJob = {
        id: 1,
        paid: false,
        price: 100,
        Contract: { ClientId: 1, ContractorId: 2 },
      };
      const mockClient = { id: 1, balance: 50 };

      const { createJobPayment } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/jobRepository.mjs': {
            findOne: async () => mockJob,
          },
          '../../src/repository/profileRepository.mjs': {
            findOne: async () => mockClient,
          },
          '../../src/error/invalidInputError.mjs': class InvalidInputError extends Error {},
        });

      try {
        await createJobPayment(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Insufficient balance');
      }
    });

    it('should rollback transaction on error', async () => {
      let rolledBack = false;
      const mockTransaction = {
        commit: async () => {},
        rollback: async () => {
          rolledBack = true;
        },
      };
      const mockSequelize = {
        transaction: async () => mockTransaction,
      };
      const mockJob = {
        id: 1,
        paid: false,
        price: 100,
        Contract: { ClientId: 1, ContractorId: 2 },
      };
      const mockClient = { id: 1, balance: 200 };
      const mockContractor = { id: 2, balance: 50 };

      const { createJobPayment } = await esmock(
        '../../src/service/jobService.mjs', {
          '../../src/config/dbConfig.mjs': mockSequelize,
          '../../src/repository/jobRepository.mjs': {
            findOne: async () => mockJob,
            save: async () => {
              throw new Error('Database error');
            },
          },
          '../../src/repository/profileRepository.mjs': {
            findOne: async id => id === 1 ? mockClient : mockContractor,
            save: async profile => profile,
          },
        });

      try {
        await createJobPayment(1);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Database error');
        expect(rolledBack).to.be.true;
      }
    });
  });
});
