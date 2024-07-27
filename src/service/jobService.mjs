import sequelize from '../config/dbConfig.mjs';
import NotFoundError from '../error/notFoundError.mjs';
import InvalidInputError from '../error/invalidInputError.mjs';
import * as profileRepository from '../repository/profileRepository.mjs';
import * as jobRepository from '../repository/jobRepository.mjs';

async function findUnpaidJobs(profileId) {
  const jobs = await jobRepository.findByProfileIdAndInProgressTrue(profileId);
  return jobs;
}

async function createJobPayment(jobId) {
  const transaction = await sequelize.transaction();

  try {
    const job = await jobRepository.findOne(jobId, transaction);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.paid) {
      throw new InvalidInputError('Job already paid');
    }

    const { Contract: { ClientId, ContractorId } } = job;
    const [ client, contractor ] = await Promise.all([
      profileRepository.findOne(ClientId, transaction),
      profileRepository.findOne(ContractorId, transaction),
    ]);

    if (client.balance < job.price) {
      throw new InvalidInputError('Insufficient balance');
    }

    client.balance -= job.price;
    contractor.balance += job.price;

    job.paid = true;
    job.paymentDate = new Date();

    await Promise.all([
      profileRepository.save(client, transaction),
      profileRepository.save(contractor, transaction),
      jobRepository.save(job, transaction),
    ]);

    await transaction.commit();

    return {
      profileId: ClientId,
      balance: client.balance,
    };

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export {
  findUnpaidJobs,
  createJobPayment,
};
