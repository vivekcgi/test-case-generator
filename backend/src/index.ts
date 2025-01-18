import './utils/dotenv';
import { Server } from '@hapi/hapi';
import Inert from '@hapi/inert';
import path from 'path';
import { config } from './config/config';
import { logger } from './utils/logger';
import { ResponseHelper } from './utils/response-helper';
import { RouteLoader } from './utils/routes-loader';
import { scheduler } from './pipelines/lib/scheduler';
import './utils/db';
import { testQueue } from './pipelines/test';

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

  // new requests > 39dafab3-ca25-4f6a-9c7d-0d404277e75c
  // scheduler.add({ name: 'test', data: { message: 'This is test message' } });
  // scheduler.add({
  //   name: 'documentation',
  //   data: {
  //     requestId: '726286cc-ea46-4774-b9ac-afb9d2c1a3cf', //'f773dfab-b046-4375-b981-aee077bfc225', // '726286cc-ea46-4774-b9ac-afb9d2c1a3cf',
  //     filename: 'sysml1.yaml',
  //     type: 'gql',
  //     message: 'This is test message',
  //   },
  // });
  // await testQueue({}, {});
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
