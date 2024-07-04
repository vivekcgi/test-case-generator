import { Model } from 'objection';
import { knex } from 'knex';
import knexConfig from '../../knexfile';

const env = process.env.NODE_ENV || 'development';
const envConfig = knexConfig[env];

export default Model.knex(knex(envConfig));
