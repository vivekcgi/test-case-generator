import './src/utils/dotenv';
import type { Knex } from 'knex';
import path from 'path';
import { config as confSettings } from './src/config/config';

// Update with your config settings.
const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: confSettings.database.host,
      port: Number(confSettings.database.port),
      database: confSettings.database.name,
      user: String(confSettings.database.user),
      password: String(confSettings.database.password),
      ssl: Boolean(confSettings.database.ssl),
    },
    version: '15',
    pool: {
      min: Number(confSettings.database.pool.min),
      max: Number(confSettings.database.pool.max),
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, './src/migrations'),
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      database: confSettings.database.name,
      user: confSettings.database.user,
      password: confSettings.database.password,
      ssl: Boolean(confSettings.database.ssl),
    },
    version: '15',
    pool: {
      min: Number(confSettings.database.pool.min),
      max: Number(confSettings.database.pool.max),
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, './src/migrations'),
    },
  },
};

export default knexConfig;
