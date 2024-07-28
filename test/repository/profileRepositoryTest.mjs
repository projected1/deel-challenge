import { expect } from 'chai';
import esmock from 'esmock';

describe('Profile Repository', () => {
  describe('save', () => {
    it('should save a profile', async () => {
      const mockProfile = { id: 1, save: async () => ({ id: 1, firstName: 'John' }) };
      const mockTransaction = {};

      const { save } = await esmock(
        '../../src/repository/profileRepository.mjs', {});

      const result = await save(mockProfile, mockTransaction);
      expect(result).to.deep.equal({ id: 1, firstName: 'John' });
    });
  });

  describe('findOne', () => {
    it('should find a profile by id', async () => {
      const mockProfile = { id: 1, firstName: 'John' };
      const mockFindOne = async options => {
        expect(options.where.id).to.equal(1);
        return mockProfile;
      };

      const { findOne } = await esmock(
        '../../src/repository/profileRepository.mjs', {
          '../../src/model/profileModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOne(1);
      expect(result).to.deep.equal(mockProfile);
    });

    it('should return null if profile not found', async () => {
      const mockFindOne = async () => null;

      const { findOne } = await esmock(
        '../../src/repository/profileRepository.mjs', {
          '../../src/model/profileModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOne(999);
      expect(result).to.be.null;
    });

    it('should return null if profile id is undefined', async () => {
      const mockFindOne = async () => null;

      const { findOne } = await esmock(
        '../../src/repository/profileRepository.mjs', {
          '../../src/model/profileModel.mjs': { findOne: mockFindOne },
        });

      const result = await findOne();
      expect(result).to.be.null;
    });
  });

  describe('findOneByJobIdAndTypeClient', () => {
    it('should find a client profile by job id', async () => {
      const mockProfile = { id: 1, type: 'client', firstName: 'John' };
      const mockFindOne = async options => {
        expect(options.where.type).to.equal('client');
        expect(options.include.model.name).to.equal('Contract');
        expect(options.include.include.model.name).to.equal('Job');
        expect(options.include.include.where.id).to.equal(1);
        return mockProfile;
      };

      const { findOneByJobIdAndTypeClient } = await esmock(
        '../../src/repository/profileRepository.mjs', {
          '../../src/model/profileModel.mjs': { findOne: mockFindOne },
          '../../src/config/enums.mjs': { ProfileTypes: { CLIENT: 'client' } },
        });

      const result = await findOneByJobIdAndTypeClient(1);
      expect(result).to.deep.equal(mockProfile);
    });

    it('should return null if no client profile found for the job', async () => {
      const mockFindOne = async () => null;

      const { findOneByJobIdAndTypeClient } = await esmock(
        '../../src/repository/profileRepository.mjs', {
          '../../src/model/profileModel.mjs': { findOne: mockFindOne },
          '../../src/config/enums.mjs': { ProfileTypes: { CLIENT: 'client' } },
        });

      const result = await findOneByJobIdAndTypeClient(999);
      expect(result).to.be.null;
    });
  });
});
