import { HttpCode } from '../config/constants.mjs';
import { findOne } from '../repository/profileRepository.mjs';

async function getProfile(req, res, next) {
  const profileId = req.get('profile_id');
  const profile = await findOne(profileId);
  if (!profile) {
    return res.status(HttpCode.HTTP_401).end();
  }
  req.profile = profile;
  next();
}

export { getProfile };
