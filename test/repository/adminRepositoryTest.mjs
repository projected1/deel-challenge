import { expect } from 'chai';
import esmock from 'esmock';
import { literal, fn, col, Op } from 'sequelize';

describe('Admin Repository', () => {
  describe('findTopEarningProfessionByDateRange', () => {
    it('should find the top earning profession', async () => {
      const mockResult = { profession: 'Developer', totalEarned: 5000 };
      const mockFindOne = async options => {
        expect(options.attributes).to.deep.include.members([
          'Contractor.profession',
          [ fn('sum', col('Jobs.price')), 'totalEarned' ],
        ]);
        expect(options.group).to.deep.equal([ 'Contractor.profession' ]);
        expect(options.order[0][0].col).to.equal('totalEarned');
        expect(options.order[0][1]).to.equal('DESC');
        return mockResult;
      };

      const { findTopEarningProfessionByDateRange } = await esmock(
        '../../src/repository/adminRepository.mjs', {
          sequelize: { literal, fn, col, Op },
          '../../src/model/contractModel.mjs': { findOne: mockFindOne },
        });

      const result = await findTopEarningProfessionByDateRange('2024-01-01', '2024-07-27');
      expect(result).to.deep.equal(mockResult);
    });

    it('should return default object if no result found', async () => {
      const mockFindOne = async () => null;

      const { findTopEarningProfessionByDateRange } = await esmock(
        '../../src/repository/adminRepository.mjs', {
          sequelize: { literal, fn, col, Op },
          '../../src/model/contractModel.mjs': { findOne: mockFindOne },
        });

      const result = await findTopEarningProfessionByDateRange('2024-01-01', '2024-07-27');
      expect(result).to.deep.equal({ profession: null, totalEarned: 0 });
    });
  });

  describe('findTopPayingClientsInDateRange', () => {
    it('should find top paying clients', async () => {
      const mockResults = [
        { id: 1, fullName: 'John Doe', paid: 1000 },
        { id: 2, fullName: 'Jane Smith', paid: 800 },
      ];
      const mockFindAll = async options => {
        expect(options.attributes).to.deep.include.members([
          'Client.id',
          [ literal('Client.firstName || " " || Client.lastName'), 'fullName' ],
          [ fn('sum', col('Jobs.price')), 'paid' ],
        ]);
        expect(options.group).to.deep.equal([ 'Client.id' ]);
        expect(options.order[0][0].col).to.equal('paid');
        expect(options.order[0][1]).to.equal('DESC');
        expect(options.limit).to.equal(2);
        return mockResults;
      };

      const { findTopPayingClientsInDateRange } = await esmock(
        '../../src/repository/adminRepository.mjs', {
          sequelize: { literal, fn, col, Op },
          '../../src/model/contractModel.mjs': { findAll: mockFindAll },
        });

      const result = await findTopPayingClientsInDateRange('2024-01-01', '2024-07-27', 2);
      expect(result).to.deep.equal(mockResults);
    });

    it('should return an empty array if no clients found', async () => {
      const mockFindAll = async () => [];

      const { findTopPayingClientsInDateRange } = await esmock(
        '../../src/repository/adminRepository.mjs', {
          sequelize: { literal, fn, col, Op },
          '../../src/model/contractModel.mjs': { findAll: mockFindAll },
        });

      const result = await findTopPayingClientsInDateRange('2024-01-01', '2024-07-27', 2);
      expect(result).to.be.an('array').that.is.empty;
    });
  });
});
