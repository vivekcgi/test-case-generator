import Queue from 'bull';
import path from 'path';
import { config } from '../../config/config';

export const scheduler = new Queue(
  'TestGenQueue',
  `redis://${config.redis.host}:${config.redis.port}`,
);
(async () => {
  const caller = await import(path.join(__dirname, './executer'));
  console.info('starting scheduler process...');
  scheduler.process(caller.default);
})();
