import winston from 'winston';
import { config } from '../config/config';

export const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors(),
  ),
  transports: [
    new winston.transports.Console({
      level: config.logger.level,
    }),
  ],
});

if (
  process.env.NODE_ENV === 'development' ||
  config.environment.node === 'development' ||
  process.env.NODE_ENV === 'test' ||
  config.environment.node === 'test'
) {
  logger.format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors(),
    winston.format.prettyPrint(),
  );
}
