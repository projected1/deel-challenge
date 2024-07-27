import DeelError from '../error/deelError.mjs';
import { HttpCode } from '../config/constants.mjs';
import { ProfileTypes } from '../config/enums.mjs';
import { saveDeposit } from '../service/balanceService.mjs';

async function makeDeposit(req, res) {
  const { amount } = req.body;
  const { userId } = req.params;
  const { id: profileId, type: profileType } = req.profile;

  const isAuthorized =
    profileId === parseInt(userId) &&
    profileType === ProfileTypes.CLIENT;
  if (!isAuthorized) {
    return res.status(HttpCode.HTTP_401).end();
  }

  try {
    const result = await saveDeposit(profileId, amount);
    return res.status(HttpCode.HTTP_200).json(result);

  } catch (err) {
    if (err instanceof DeelError) {
      return res.status(err.code).end();
    }

    throw err;
  }
}

export { makeDeposit };
