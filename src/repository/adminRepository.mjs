import { Op, fn, col } from 'sequelize';
import Job from '../model/jobModel.mjs';
import Profile from '../model/profileModel.mjs';
import Contract from '../model/contractModel.mjs';

async function findTopEarningProfessionByDateRange(startDate, endDate) {
  const res = await Contract.findOne({
    attributes: [
      'Contractor.profession',
      [ fn('sum', col('Jobs.price')), 'totalEarned' ],
    ],
    group: [ 'Contractor.profession' ],
    include: [
      {
        model: Job,
        where: {
          paymentDate: {
            [Op.between]: [ startDate, endDate ],
          },
        },
        required: true,
        attributes: [],
      },
      {
        model: Profile,
        as: 'Contractor',
        required: true,
        attributes: [],
      },
    ],
    order: [ [ col('totalEarned'), 'DESC' ] ],
    subQuery: false,
    raw: true,
  });
  return res || { profession: null, totalEarned: 0 };
}

export {
  findTopEarningProfessionByDateRange,
};
