import { expect } from 'chai';
import esmock from 'esmock';

describe('Profile Service', () => {
  describe('findClientProfile', () => {
    it('should return a client profile when found', async () => {
      const mockProfile = { id: 1, firstName: 'John', lastName: 'Doe', type: 'client' };
      const { findClientProfile } = await esmock(
        '../../src/service/profileService.mjs', {
          '../../src/repository/profileRepository.mjs': {
            findOneByJobIdAndTypeClient: async () => mockProfile,
          },
        });

      const result = await findClientProfile(1);

      expect(result).to.deep.equal(mockProfile);
    });

    it('should return null when client profile not found', async () => {
      const { findClientProfile } = await esmock(
        '../../src/service/profileService.mjs', {
          '../../src/repository/profileRepository.mjs': {
            findOneByJobIdAndTypeClient: async () => null,
          },
        });

      const result = await findClientProfile(1);

      expect(result).to.be.null;
    });

    it('should call findOneByJobIdAndTypeClient with correct jobId', async () => {
      let calledWithJobId;
      const { findClientProfile } = await esmock(
        '../../src/service/profileService.mjs', {
          '../../src/repository/profileRepository.mjs': {
            findOneByJobIdAndTypeClient: async jobId => {
              calledWithJobId = jobId;
              return null;
            },
          },
        });

      await findClientProfile(42);

      expect(calledWithJobId).to.equal(42);
    });
  });
});
