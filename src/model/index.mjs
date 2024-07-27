import Job from './jobModel.mjs';
import Profile from './profileModel.mjs';
import Contract from './contractModel.mjs';
import sequelize from '../config/dbConfig.mjs';

Profile.hasMany(Contract, { as :'Contractor',foreignKey:'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as : 'Client', foreignKey:'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

export {
  Job,
  Profile,
  Contract,
  sequelize,
};
