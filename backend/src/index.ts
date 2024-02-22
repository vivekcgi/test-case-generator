import './utils/dotenv';
import { Server } from '@hapi/hapi';
import Inert from '@hapi/inert'
import path from 'path';
import { config } from './config/config';
import { logger } from './utils/logger';
import { ResponseHelper } from './utils/response-helper';
import { RouteLoader } from './utils/routes-loader';

const server = new Server({
  port: config.port,
  routes: {
    cors: true,
    validate: {
      failAction: async (_, h, err: any) => {
        const response = ResponseHelper.error(err.details[0].message, null, 400);
        return h.response(response.data).code(response.code).takeover();
      },
    },
    state: {
      parse: false,
      failAction: 'ignore',
    },
  },
});

const init = async () => {
  await server.register(Inert);

  // Register routes
  const routes = await RouteLoader.load(path.join(__dirname, '/routes'));
  server.route(routes);

  await server.start();
  logger.info(`server started at ${server.info.uri}`, server.info);
};

process.on('SIGINT', (err) => {
  logger.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

init();

declare module '@hapi/hapi' {
  interface RequestApplicationState {
    token: string;
  }
}
