import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes.mjs';
import { sequelize } from './model/index.mjs';

const app = express();

app.use(bodyParser.json());
app.use('/', routes);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

export default app;
