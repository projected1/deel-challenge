import { expect } from 'chai';
import esmock from 'esmock';

describe('Admin Service', () => {
  describe('findBestProfession', () => {
    it('should return the best profession for given date range', async () => {
      const mockProfession = { profession: 'Pokemon master', total: 5000 };
      const { findBestProfession } = await esmock(
        '../../src/service/adminService.mjs', {
          '../../src/repository/adminRepository.mjs': {
            findTopEarningProfessionByDateRange: async () => mockProfession,
          },
        });

      const result = await findBestProfession('2024-01-01', '2024-07-27');

      expect(result).to.deep.equal(mockProfession);
    });

    it('should return null if no profession found', async () => {
      const { findBestProfession } = await esmock(
        '../../src/service/adminService.mjs', {
          '../../src/repository/adminRepository.mjs': {
            findTopEarningProfessionByDateRange: async () => null,
          },
        });

      const result = await findBestProfession('2024-01-01', '2024-07-27');

      expect(result).to.be.null;
    });
  });

  describe('findBestClients', () => {
    it('should return the best clients for given date range with default limit', async () => {
      const mockClients = [
        { id: 1, fullName: 'Mr Robot', paid: 1000 },
        { id: 2, fullName: 'Ash Kethcum', paid: 800 },
      ];
      const { findBestClients } = await esmock(
        '../../src/service/adminService.mjs', {
          '../../src/repository/adminRepository.mjs': {
            findTopPayingClientsInDateRange: async (start, end, limit) => {
              expect(limit).to.equal(2);
              return mockClients;
            },
          },
        });

      const result = await findBestClients('2024-01-01', '2024-07-27');

      expect(result).to.deep.equal(mockClients);
    });

    it('should return the best clients for given date range with custom limit', async () => {
      const mockClients = [
        { id: 1, fullName: 'Mr Robot', paid: 1000 },
        { id: 2, fullName: 'Ash Kethcum', paid: 800 },
        { id: 3, fullName: 'Alan Turing', paid: 600 },
      ];
      const { findBestClients } = await esmock(
        '../../src/service/adminService.mjs', {
          '../../src/repository/adminRepository.mjs': {
            findTopPayingClientsInDateRange: async (start, end, limit) => {
              expect(limit).to.equal(3);
              return mockClients;
            },
          },
        });

      const result = await findBestClients('2024-01-01', '2024-07-27', 3);

      expect(result).to.deep.equal(mockClients);
    });

    it('should return an empty array if no clients found', async () => {
      const { findBestClients } = await esmock(
        '../../src/service/adminService.mjs', {
          '../../src/repository/adminRepository.mjs': {
            findTopPayingClientsInDateRange: async () => [],
          },
        });

      const result = await findBestClients('2024-01-01', '2024-07-27');

      expect(result).to.be.an('array').that.is.empty;
    });
  });
});
