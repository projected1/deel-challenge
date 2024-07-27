import Profile from '../model/profileModel.mjs';

async function findOne(profileId) {
  const profile = await Profile.findOne({ where: { id: profileId || 0 } });
  return profile;
}

export {
  findOne,
};
