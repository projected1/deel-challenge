import Job from '../model/jobModel.mjs';
import Profile from '../model/profileModel.mjs';
import Contract from '../model/contractModel.mjs';
import { ContractStatuses } from '../config/enums.mjs';

async function sumPriceByContractStatusInProgress(profileId, transaction) {
  const sum = Job.sum('price', {
    include: {
      model: Contract,
      where: {
        ClientId: profileId,
        status: ContractStatuses.IN_PROGRESS,
      },
      required: true,
      attributes: [],
    },
    transaction,
  });
  return sum;
}

async function incrementBalanceByAmount(profileId, amount, transaction) {
  const q1 = Profile.increment('balance', {
    by: amount,
    where: {
      id: profileId,
    },
    transaction,
  });

  const q2 = Profile.findOne({
    attributes: [ 'balance' ],
    where: {
      id: profileId,
    },
    transaction,
  });

  const [ , profile ] = await Promise.all([ q1, q2 ]);
  return profile.balance;
}

export {
  incrementBalanceByAmount,
  sumPriceByContractStatusInProgress,
};
