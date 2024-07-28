import { expect } from 'chai';
import esmock from 'esmock';
import { Op } from 'sequelize';

describe('Job Repository', () => {
  describe('save', () => {
    it('should save a job', async () => {
      const mockJob = { id: 1, save: async () => ({ id: 1, price: 100 }) };
      const mockTransaction = {};

      const { save } = await esmock(
        '../../src/repository/jobRepository.mjs', {});

      const result = await save(mockJob, mockTransaction);
      expect(result).to.deep.equal({ id: 1, price: 100 });
    });
  });

  describe('findOne', () => {
    it('should find a job by id', async () => {
      const mockJob = { id: 1, price: 100 };
      const mockFindOne = async options => {
        expect(options.where.id).to.equal(1);
        expect(options.include.model.name).to.equal('Contract');
        return mockJob;
      };

      const { findOne } = await esmock(
        '../../src/repository/jobRepository.mjs', {
          '../../src/model/jobModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOne(1);
      expect(result).to.deep.equal(mockJob);
    });

    it('should return null if job not found', async () => {
      const mockFindOne = async () => null;

      const { findOne } = await esmock(
        '../../src/repository/jobRepository.mjs', {
          '../../src/model/jobModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOne(999);
      expect(result).to.be.null;
    });
  });

  describe('findByProfileIdAndInProgressTrue', () => {
    it('should find in-progress jobs for a profile', async () => {
      const mockJobs = [ { id: 1, price: 100 }, { id: 2, price: 200 } ];
      const mockFindAll = async options => {
        expect(options.where.paid[Op.not]).to.be.true;
        expect(options.include.model.name).to.equal('Contract');
        expect(options.include.where.status[Op.not]).to.equal('terminated');
        expect(options.include.where[Op.or]).to.deep.equal([
          { ClientId: 1 },
          { ContractorId: 1 },
        ]);
        return mockJobs;
      };

      const { findByProfileIdAndInProgressTrue } = await esmock(
        '../../src/repository/jobRepository.mjs', {
          sequelize: { Op },
          '../../src/model/jobModel.mjs': { findAll: mockFindAll },
          '../../src/config/enums.mjs': { ContractStatuses: { TERMINATED: 'terminated' } },
        });

      const result = await findByProfileIdAndInProgressTrue(1);
      expect(result).to.deep.equal(mockJobs);
    });

    it('should return an empty array if no in-progress jobs found', async () => {
      const mockFindAll = async () => [];

      const { findByProfileIdAndInProgressTrue } = await esmock(
        '../../src/repository/jobRepository.mjs', {
          sequelize: { Op },
          '../../src/model/jobModel.mjs': { findAll: mockFindAll },
          '../../src/config/enums.mjs': { ContractStatuses: { TERMINATED: 'terminated' } },
        });

      const result = await findByProfileIdAndInProgressTrue(999);
      expect(result).to.be.an('array').that.is.empty;
    });
  });
});
