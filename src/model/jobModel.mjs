import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.mjs';

class Job extends Model {}

Job.init(
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price:{
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      default:false,
    },
    paymentDate:{
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Job',
  },
);

export default Job;
