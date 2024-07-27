import sequelize from '../config/dbConfig.mjs';
import InvalidInputError from '../error/invalidInputError.mjs';
import {
  incrementBalanceByAmount,
  sumPriceByContractStatusInProgress,
} from '../repository/balanceRepository.mjs';

async function saveDeposit(profileId, amount) {
  const transaction = await sequelize.transaction();

  try {
    const debit = await sumPriceByContractStatusInProgress(
      profileId,
      transaction,
    );

    const maxDeposit = debit / 4;
    if (amount > maxDeposit) {
      throw new InvalidInputError(`Max deposit amount is ${maxDeposit}`);
    }

    const balance = await incrementBalanceByAmount(
      profileId,
      amount,
      transaction,
    );

    await transaction.commit();

    return { profileId, balance };

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export { saveDeposit };
