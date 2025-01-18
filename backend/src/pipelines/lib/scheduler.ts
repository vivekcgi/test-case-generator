import Queue from 'bull';
import path from 'path';
import fs from 'fs';
import { config } from '../../config/config';

const getExecutor = () => {
  const tsFile = 'executer.ts';
  const jsFile = 'executer.js';
  if (fs.existsSync(path.join(__dirname, `./${tsFile}`))) {
    return path.join(__dirname, `./${tsFile}`);
  } else {
    return path.join(__dirname, `./${jsFile}`);
  }
};

export const scheduler = new Queue(
  'TestGenQueue',
  `redis://${config.redis.host}:${config.redis.port}`,
);
(async () => {
  const caller = await import(getExecutor());
  console.info('starting scheduler process...');
  scheduler.process(caller.default);
})();
