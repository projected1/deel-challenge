import { expect } from 'chai';
import esmock from 'esmock';
import { Op } from 'sequelize';

describe('Contract Repository', () => {
  describe('findOneByIdAndProfileId', () => {
    it('should find a contract by id and profile id', async () => {
      const mockContract = { id: 1, ClientId: 1, ContractorId: 2 };
      const mockFindOne = async options => {
        expect(options.where.id).to.equal(1);
        expect(options.where[Op.or]).to.deep.equal([
          { ClientId: 1 },
          { ContractorId: 1 },
        ]);
        return mockContract;
      };

      const { findOneByIdAndProfileId } = await esmock(
        '../../src/repository/contractRepository.mjs', {
          sequelize: { Op },
          '../../src/model/contractModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOneByIdAndProfileId(1, 1);

      expect(result).to.deep.equal(mockContract);
    });

    it('should return null if no contract found', async () => {
      const mockFindOne = async () => null;

      const { findOneByIdAndProfileId } = await esmock(
        '../../src/repository/contractRepository.mjs', {
          sequelize: { Op },
          '../../src/model/contractModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOneByIdAndProfileId(1, 1);

      expect(result).to.be.null;
    });
  });

  describe('findByProfileIdAndTerminatedFalse', () => {
    it('should find all non-terminated contracts for a profile', async () => {
      const mockContracts = [
        { id: 1, status: 'new', ClientId: 1 },
        { id: 2, status: 'in_progress', ContractorId: 1 },
      ];
      const mockFindAll = async options => {
        expect(options.where.status[Op.ne]).to.equal('terminated');
        expect(options.where[Op.or]).to.deep.equal([
          { ClientId: 1 },
          { ContractorId: 1 },
        ]);
        return mockContracts;
      };

      const { findByProfileIdAndTerminatedFalse } = await esmock(
        '../../src/repository/contractRepository.mjs', {
          sequelize: { Op },
          '../../src/model/contractModel.mjs': { findAll: mockFindAll },
        });

      const result = await findByProfileIdAndTerminatedFalse(1);

      expect(result).to.deep.equal(mockContracts);
    });

    it('should return an empty array if no contracts found', async () => {
      const mockFindAll = async () => [];

      const { findByProfileIdAndTerminatedFalse } = await esmock(
        '../../src/repository/contractRepository.mjs', {
          sequelize: { Op },
          '../../src/model/contractModel.mjs': { findAll: mockFindAll },
        });

      const result = await findByProfileIdAndTerminatedFalse(1);

      expect(result).to.be.an('array').that.is.empty;
    });
  });
});
