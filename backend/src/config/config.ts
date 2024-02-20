export const config = {
  port: process.env.PORT,
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
  environment: {
    node: process.env.ENVIRONMENT ?? 'development',
  },
};
